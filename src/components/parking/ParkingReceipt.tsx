import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, MapPin, Clock, Car, CreditCard, Download } from 'lucide-react';
import type { Booking, ParkingSpot, PlanOption } from '@/types/parking';

interface ParkingReceiptProps {
  booking: Booking;
  spot: ParkingSpot;
  plan: PlanOption;
  onClose: () => void;
}

export const ParkingReceipt = ({ booking, spot, plan, onClose }: ParkingReceiptProps) => {
  const entryTime = new Date(booking.entry_time);

  const handleDownload = () => {
    // Create a printable version of the receipt
    const receiptContent = `
PARKVUE - Parking Receipt
========================

Booking Confirmed!
Your parking spot has been reserved

PARKING LOCATION: ${spot.spot_number}
Floor ${spot.floor_level} • Section ${spot.section}

BOOKING DETAILS:
- Booking ID: ${booking.id.slice(0, 8).toUpperCase()}
- Vehicle Number: ${booking.vehicle_number}
- Vehicle Type: ${booking.vehicle_type.replace('wheeler', '-Wheeler')}
- Plan Type: ${plan.name}

TIMING INFORMATION:
- Entry Time: ${entryTime.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
- Status: Active

PAYMENT SUMMARY:
- Plan Cost: ₹${plan.price}
- Service Charge: ₹10
- Total Paid: ₹${booking.payment_amount + 10}
- Payment Method: ${booking.payment_method === 'card' ? 'Card Payment' : 'Online Payment'}

CUSTOMER INFORMATION:
- Name: ${booking.user_name}
- Contact: ${booking.contact_number}
- Email: ${booking.email}

IMPORTANT INSTRUCTIONS:
• Keep this receipt with you at all times
• Note your parking location: ${spot.spot_number}
• For exit, use the same contact details for verification
• Contact support if you need assistance

Generated on: ${new Date().toLocaleString('en-IN')}
========================
PARKVUE - Smart Parking Solution
    `;

    // Create and download the file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parking-receipt-${booking.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-elevated receipt-print">
        <CardHeader className="text-center bg-parking-available/10">
          <div className="mx-auto mb-4 w-16 h-16 bg-parking-available rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-parking-available">
            Booking Confirmed!
          </CardTitle>
          <p className="text-muted-foreground">Your parking spot has been reserved</p>
        </CardHeader>

        <CardContent className="p-6">
          {/* Parking Location - Prominent Display */}
          <div className="text-center mb-8 p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Your Parking Location</span>
            </div>
            <div className="text-6xl font-bold text-primary mb-2">
              {spot.spot_number}
            </div>
            <p className="text-muted-foreground">
              Floor {spot.floor_level} • Section {spot.section}
            </p>
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Car className="h-4 w-4" />
                Booking Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Booking ID</p>
                  <p className="font-medium">{booking.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vehicle Number</p>
                  <p className="font-medium">{booking.vehicle_number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vehicle Type</p>
                  <p className="font-medium capitalize">{booking.vehicle_type.replace('wheeler', '-Wheeler')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plan Type</p>
                  <p className="font-medium">{plan.name}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timing Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Entry Time</p>
                  <p className="font-medium">
                    {entryTime.toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-parking-available">Active</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Plan Cost</span>
                  <span>₹{plan.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>₹10</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total Paid</span>
                  <span>₹{booking.payment_amount + 10}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Payment Method: {booking.payment_method === 'card' ? 'Card Payment' : 'Online Payment'}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Customer Information</h3>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Name:</span> {booking.user_name}</p>
                <p><span className="text-muted-foreground">Contact:</span> {booking.contact_number}</p>
                <p><span className="text-muted-foreground">Email:</span> {booking.email}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Important Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Keep this receipt with you at all times</li>
                <li>• Note your parking location: <strong>{spot.spot_number}</strong></li>
                <li>• For exit, use the same contact details for verification</li>
                <li>• Contact support if you need assistance</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={handleDownload} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button onClick={onClose} className="flex-1">
                Proceed to Gate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};