import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { jsPDF } from "npm:jspdf@2.5.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReceiptRequest {
  booking: any;
  spot: any;
  plan: any;
  recipientEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { booking, spot, plan, recipientEmail }: ReceiptRequest = await req.json();

    console.log("Generating PDF receipt for:", recipientEmail);

    // Create decorative PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Header with gradient effect (simulated with rectangles)
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("PARKVUE", pageWidth / 2, 15, { align: "center" });
    
    doc.setFontSize(16);
    doc.text("Booking Confirmed!", pageWidth / 2, 25, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Your parking spot has been reserved", pageWidth / 2, 31, { align: "center" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Parking Location Box
    let yPos = 50;
    doc.setFillColor(239, 246, 255); // blue-50
    doc.setDrawColor(59, 130, 246); // blue-500
    doc.setLineWidth(1);
    doc.rect(20, yPos, pageWidth - 40, 35, 'FD');
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Your Parking Location", pageWidth / 2, yPos + 8, { align: "center" });
    
    doc.setTextColor(29, 78, 216); // blue-700
    doc.setFontSize(36);
    doc.text(spot.spot_number, pageWidth / 2, yPos + 22, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Floor ${spot.floor_level} • Section ${spot.section}`, pageWidth / 2, yPos + 30, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    
    // Booking Details Section
    yPos = 95;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Details", 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Booking ID", 20, yPos);
    doc.text("Vehicle Number", 110, yPos);
    
    yPos += 5;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(booking.id.slice(0, 8).toUpperCase(), 20, yPos);
    doc.text(booking.vehicle_number, 110, yPos);
    
    yPos += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Vehicle Type", 20, yPos);
    doc.text("Plan Type", 110, yPos);
    
    yPos += 5;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(booking.vehicle_type.replace('wheeler', '-Wheeler'), 20, yPos);
    doc.text(plan.name, 110, yPos);
    
    // Timing Information
    yPos += 12;
    doc.setFontSize(12);
    doc.text("Timing Information", 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Entry Time", 20, yPos);
    doc.text("Status", 110, yPos);
    
    yPos += 5;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    const entryTime = new Date(booking.entry_time);
    doc.text(entryTime.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }), 20, yPos);
    doc.setTextColor(16, 185, 129);
    doc.text("Active", 110, yPos);
    doc.setTextColor(0, 0, 0);
    
    // Payment Summary
    yPos += 12;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary", 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Plan Cost", 20, yPos);
    doc.text(`₹${plan.price}`, pageWidth - 20, yPos, { align: "right" });
    
    yPos += 6;
    doc.text("Service Charge", 20, yPos);
    doc.text("₹10", pageWidth - 20, yPos, { align: "right" });
    
    yPos += 8;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    
    yPos += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total Paid", 20, yPos);
    doc.text(`₹${booking.payment_amount + 10}`, pageWidth - 20, yPos, { align: "right" });
    
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text(`Payment Method: ${booking.payment_method === 'card' ? 'Card Payment' : 'Online Payment'}`, 20, yPos);
    doc.setTextColor(0, 0, 0);
    
    // Customer Information
    yPos += 12;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Name:", 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(booking.user_name, 50, yPos);
    
    yPos += 6;
    doc.setTextColor(107, 114, 128);
    doc.text("Contact:", 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(booking.contact_number, 50, yPos);
    
    yPos += 6;
    doc.setTextColor(107, 114, 128);
    doc.text("Email:", 20, yPos);
    doc.setTextColor(0, 0, 0);
    doc.text(booking.email, 50, yPos);
    
    // Instructions Box
    yPos += 12;
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.rect(20, yPos, pageWidth - 40, 35, 'FD');
    
    yPos += 7;
    doc.setTextColor(30, 64, 175); // blue-800
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Important Instructions:", 25, yPos);
    
    yPos += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 58, 138); // blue-900
    const instructions = [
      "• Keep this receipt with you at all times",
      `• Note your parking location: ${spot.spot_number}`,
      "• For exit, use the same contact details for verification",
      "• Contact support if you need assistance"
    ];
    
    instructions.forEach((instruction) => {
      doc.text(instruction, 25, yPos);
      yPos += 5;
    });
    
    // Footer
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, pageWidth / 2, pageHeight - 15, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.text("PARKVUE - Smart Parking Solution", pageWidth / 2, pageHeight - 10, { align: "center" });
    
    // Convert PDF to base64
    const pdfBase64 = doc.output('datauristring').split(',')[1];

    console.log("Sending email with PDF attachment...");

    // Send simple thank you email with PDF
    const emailResponse = await resend.emails.send({
      from: "Smart Parking <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Parking Receipt - Booking Confirmed`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #10b981; text-align: center;">Thank You!</h1>
          <p style="font-size: 16px; color: #333;">Dear ${booking.user_name},</p>
          <p style="font-size: 14px; color: #666;">
            Thank you for choosing our Smart Parking System. Your booking has been confirmed successfully.
          </p>
          <p style="font-size: 14px; color: #666;">
            Please find your detailed parking receipt attached to this email.
          </p>
          <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="font-size: 18px; font-weight: bold; color: #059669; margin: 0;">
              Parking Spot: ${spot.spot_number}
            </p>
          </div>
          <p style="font-size: 14px; color: #666;">
            We wish you a pleasant parking experience!
          </p>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Best regards,<br>
            <strong>PARKVUE Team</strong>
          </p>
          <p style="color: #999; font-size: 11px; margin-top: 30px; text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `parking-receipt-${booking.id}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-receipt-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
