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
    // Create HTML content for the receipt
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PARKVUE - Parking Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .location { text-align: center; background: #eff6ff; border: 2px solid #3b82f6; padding: 30px; border-radius: 12px; margin: 20px 0; }
        .location-number { font-size: 48px; font-weight: bold; color: #1d4ed8; margin: 10px 0; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .section h3 { margin: 0 0 10px 0; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .field { margin: 8px 0; }
        .label { color: #6b7280; font-size: 14px; }
        .value { font-weight: 600; color: #111827; }
        .total { font-size: 18px; font-weight: bold; padding-top: 10px; border-top: 2px solid #374151; }
        .instructions { background: #eff6ff; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .instructions h4 { color: #1e40af; margin: 0 0 10px 0; }
        .instructions ul { margin: 0; padding-left: 20px; color: #1e40af; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PARKVUE</h1>
        <h2>Booking Confirmed!</h2>
        <p>Your parking spot has been reserved</p>
    </div>

    <div class="location">
        <h3>Your Parking Location</h3>
        <div class="location-number">${spot.spot_number}</div>
        <p>Floor ${spot.floor_level} • Section ${spot.section}</p>
    </div>

    <div class="section">
        <h3>Booking Details</h3>
        <div class="grid">
            <div class="field">
                <div class="label">Booking ID</div>
                <div class="value">${booking.id.slice(0, 8).toUpperCase()}</div>
            </div>
            <div class="field">
                <div class="label">Vehicle Number</div>
                <div class="value">${booking.vehicle_number}</div>
            </div>
            <div class="field">
                <div class="label">Vehicle Type</div>
                <div class="value">${booking.vehicle_type.replace('wheeler', '-Wheeler')}</div>
            </div>
            <div class="field">
                <div class="label">Plan Type</div>
                <div class="value">${plan.name}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>Timing Information</h3>
        <div class="grid">
            <div class="field">
                <div class="label">Entry Time</div>
                <div class="value">${entryTime.toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</div>
            </div>
            <div class="field">
                <div class="label">Status</div>
                <div class="value" style="color: #10b981;">Active</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h3>Payment Summary</h3>
        <div class="field">
            <div style="display: flex; justify-content: space-between;">
                <span>Plan Cost</span>
                <span>₹${plan.price}</span>
            </div>
        </div>
        <div class="field">
            <div style="display: flex; justify-content: space-between;">
                <span>Service Charge</span>
                <span>₹10</span>
            </div>
        </div>
        <div class="field total">
            <div style="display: flex; justify-content: space-between;">
                <span>Total Paid</span>
                <span>₹${booking.payment_amount + 10}</span>
            </div>
        </div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 8px;">
            Payment Method: ${booking.payment_method === 'card' ? 'Card Payment' : 'Online Payment'}
        </div>
    </div>

    <div class="section">
        <h3>Customer Information</h3>
        <div class="field">
            <div class="label">Name</div>
            <div class="value">${booking.user_name}</div>
        </div>
        <div class="field">
            <div class="label">Contact</div>
            <div class="value">${booking.contact_number}</div>
        </div>
        <div class="field">
            <div class="label">Email</div>
            <div class="value">${booking.email}</div>
        </div>
    </div>

    <div class="instructions">
        <h4>Important Instructions:</h4>
        <ul>
            <li>Keep this receipt with you at all times</li>
            <li>Note your parking location: <strong>${spot.spot_number}</strong></li>
            <li>For exit, use the same contact details for verification</li>
            <li>Contact support if you need assistance</li>
        </ul>
    </div>

    <div class="footer">
        <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
        <p><strong>PARKVUE - Smart Parking Solution</strong></p>
    </div>
</body>
</html>
    `;

    // Create and download the HTML file
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parking-receipt-${booking.id.slice(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-2xl border-2 border-gray-200 bg-white receipt-print" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      }}>
        <CardHeader className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
          <div className="mx-auto mb-4 w-16 h-16 bg-parking-available rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-parking-available">
            Booking Confirmed!
          </CardTitle>
          <p className="text-muted-foreground">Your parking spot has been reserved</p>
        </CardHeader>

        <CardContent className="p-8 bg-white">
          {/* Parking Location - Prominent Display */}
          <div className="text-center mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-lg">
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

            <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 rounded-xl p-6 shadow-inner">
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