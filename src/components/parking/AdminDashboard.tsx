import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Car, BarChart3, Clock, Trash2, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ParkingSpot, Booking } from '@/types/parking';

interface AdminDashboardProps {
  onBack: () => void;
}

import { useLanguage } from '@/hooks/useLanguage';

interface DashboardStats {
  totalSpots: number;
  occupiedSpots: number;
  availableSpots: number;
  activeBookings: number;
  totalRevenue: number;
}

export const AdminDashboard = ({ onBack }: AdminDashboardProps) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSpots: 0,
    occupiedSpots: 0,
    availableSpots: 0,
    activeBookings: 0,
    totalRevenue: 0
  });
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [recentBookings, setRecentBookings] = useState<(Booking & { parking_spots?: ParkingSpot })[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscription
    const spotsSubscription = supabase
      .channel('parking-spots-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_spots'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    const bookingsSubscription = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      spotsSubscription.unsubscribe();
      bookingsSubscription.unsubscribe();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch parking spots
      const { data: spotsData } = await supabase
        .from('parking_spots')
        .select('*')
        .order('spot_number');

      // Fetch ALL bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          parking_spots (*)
        `)
        .order('created_at', { ascending: false});

      // Calculate stats
      if (spotsData) {
        setSpots(spotsData as ParkingSpot[]);
        
        const totalSpots = spotsData.length;
        const occupiedSpots = spotsData.filter(spot => spot.is_occupied).length;
        const availableSpots = totalSpots - occupiedSpots;
        
        // Calculate active bookings and revenue from the fetched data
        const activeBookings = bookingsData?.filter(booking => booking.status === 'active').length || 0;
        const totalRevenue = bookingsData?.reduce((sum, booking) => sum + (Number(booking.payment_amount) || 0), 0) || 0;

        setStats({
          totalSpots,
          occupiedSpots,
          availableSpots,
          activeBookings,
          totalRevenue
        });
      }

      if (bookingsData) {
        setRecentBookings(bookingsData as any[]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const getSpotStatusColor = (spot: ParkingSpot) => {
    if (spot.is_occupied) return 'bg-parking-occupied text-white';
    
    switch (spot.spot_type) {
      case 'vip':
        return 'bg-parking-vip text-white';
      case 'ev_charging':
        return 'bg-parking-ev text-white';
      default:
        return 'bg-parking-available text-white';
    }
  };

  const getSpotTypeIcon = (type: string) => {
    switch (type) {
      case 'vip':
        return '👑';
      case 'ev_charging':
        return '⚡';
      default:
        return '🚗';
    }
  };

  const clearAllBookings = async () => {
    if (!confirm('Are you sure you want to clear all bookings and reset the parking system? This action cannot be undone.')) {
      return;
    }

    try {
      // First, make all parking spots available
      const { error: spotsError } = await supabase
        .from('parking_spots')
        .update({ is_occupied: false })
        .gte('id', 0); // Update all records

      if (spotsError) {
        throw spotsError;
      }

      // Then delete all bookings
      const { error: bookingsError } = await supabase
        .from('bookings')
        .delete()
        .gte('created_at', '1900-01-01'); // Delete all records by using a date condition

      if (bookingsError) {
        throw bookingsError;
      }

      // Reset states immediately
      setStats({
        totalSpots: spots.length,
        occupiedSpots: 0,
        availableSpots: spots.length,
        activeBookings: 0,
        totalRevenue: 0
      });
      setRecentBookings([]);

      toast({
        title: "System Reset Complete",
        description: "All bookings cleared and parking spots are now available"
      });

      // Refresh data to ensure consistency
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to clear bookings:', error);
      toast({
        title: "Reset Failed",
        description: "Failed to reset the parking system",
        variant: "destructive"
      });
    }
  };

  const downloadExcelData = async () => {
    try {
      // Fetch all bookings with parking spot details
      const { data: allBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          parking_spots (*)
        `)
        .order('created_at', { ascending: false });

      if (!allBookings || allBookings.length === 0) {
        toast({
          title: "No Data",
          description: "No booking data available to download"
        });
        return;
      }

      // Convert to CSV format
      const headers = [
        'Name',
        'Arriving Time', 
        'Contact No',
        'Email ID',
        'Vehicle Type',
        'Vehicle Number',
        'Parking Type',
        'Payment Details',
        'Exit Time'
      ];

      const csvContent = [
        headers.join(','),
        ...allBookings.map(booking => [
          booking.user_name,
          new Date(booking.entry_time).toLocaleString('en-IN'),
          booking.contact_number,
          booking.email,
          booking.vehicle_type.replace('wheeler', '-Wheeler'),
          booking.vehicle_number,
          booking.plan_type,
          `${booking.payment_method} - ₹${booking.payment_amount}`,
          booking.exit_time ? new Date(booking.exit_time).toLocaleString('en-IN') : 'NOT_EXITED'
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parking-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Complete",
        description: "Parking data has been downloaded successfully"
      });
    } catch (error) {
      console.error('Failed to download data:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download parking data",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <Card className="shadow-elevated mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                {t('admin_dashboard')}
              </CardTitle>
              <p className="text-muted-foreground">{t('admin_overview')}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadExcelData}>
                <Download className="mr-2 h-4 w-4" />
                Download Data
              </Button>
              <Button variant="outline" onClick={clearAllBookings}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Bookings
              </Button>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalSpots}</div>
            <p className="text-sm text-muted-foreground">Total Spots</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-parking-occupied">{stats.occupiedSpots}</div>
            <p className="text-sm text-muted-foreground">Occupied</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-parking-available">{stats.availableSpots}</div>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{stats.activeBookings}</div>
            <p className="text-sm text-muted-foreground">Active Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-parking-vip">₹{stats.totalRevenue}</div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Parking Spots Grid */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Parking Spots Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className={`p-3 rounded-lg text-center text-xs font-medium ${getSpotStatusColor(spot)}`}
                  title={`${spot.spot_number} - ${spot.spot_type} - ${spot.is_occupied ? 'Occupied' : 'Available'}`}
                >
                  <div className="mb-1">{getSpotTypeIcon(spot.spot_type)}</div>
                  <div>{spot.spot_number}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-parking-available rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-parking-occupied rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-parking-vip rounded"></div>
                <span>VIP</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-parking-ev rounded"></div>
                <span>EV Charging</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{booking.user_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.vehicle_number} • {(booking as any).parking_spots?.spot_number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={booking.status === 'active' ? 'default' : 'secondary'}>
                      {booking.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{booking.payment_amount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};