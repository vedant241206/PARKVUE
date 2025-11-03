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

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PARKING RECEIPT", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Smart Parking System", pageWidth / 2, 28, { align: "center" });
    
    // Booking Details
    let yPos = 45;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Details", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Booking ID: ${booking.id}`, 20, yPos);
    yPos += 7;
    doc.text(`Date: ${new Date(booking.created_at).toLocaleDateString()}`, 20, yPos);
    yPos += 7;
    doc.text(`Status: ${booking.status.toUpperCase()}`, 20, yPos);
    
    // Parking Location
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Parking Location", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Spot Number: ${spot.spot_number}`, 20, yPos);
    yPos += 7;
    doc.text(`Floor: ${spot.floor_level}`, 20, yPos);
    yPos += 7;
    doc.text(`Section: ${spot.section}`, 20, yPos);
    yPos += 7;
    doc.text(`Type: ${plan.name}`, 20, yPos);
    
    // Timing
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Timing Details", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Entry Time: ${new Date(booking.entry_time).toLocaleString()}`, 20, yPos);
    if (booking.exit_time) {
      yPos += 7;
      doc.text(`Exit Time: ${new Date(booking.exit_time).toLocaleString()}`, 20, yPos);
    }
    
    // Payment Summary
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Summary", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Plan: ${plan.name}`, 20, yPos);
    yPos += 7;
    doc.text(`Amount: ₹${booking.payment_amount}`, 20, yPos);
    yPos += 7;
    doc.text(`Payment Method: ${booking.payment_method.toUpperCase()}`, 20, yPos);
    
    // Customer Information
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${booking.user_name}`, 20, yPos);
    yPos += 7;
    doc.text(`Contact: ${booking.contact_number}`, 20, yPos);
    yPos += 7;
    doc.text(`Email: ${booking.email}`, 20, yPos);
    yPos += 7;
    doc.text(`Vehicle: ${booking.vehicle_number}`, 20, yPos);
    yPos += 7;
    doc.text(`Vehicle Type: ${booking.vehicle_type}`, 20, yPos);
    
    // Instructions
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Important Instructions", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const instructions = [
      "• Please keep this receipt for your records",
      "• Present this receipt at the exit gate",
      "• Follow all parking regulations",
      "• Park only in the designated spot",
      "• Contact support for any issues"
    ];
    
    instructions.forEach((instruction) => {
      doc.text(instruction, 20, yPos);
      yPos += 6;
    });
    
    // Footer
    yPos += 10;
    doc.setFontSize(8);
    doc.text("Thank you for using our parking system!", pageWidth / 2, yPos, { align: "center" });
    yPos += 5;
    doc.text("For support: support@parking.com", pageWidth / 2, yPos, { align: "center" });
    
    // Convert PDF to base64
    const pdfBase64 = doc.output('datauristring').split(',')[1];

    console.log("Sending email with PDF attachment...");

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Smart Parking <vedantpawar434@gmail.com>",
      to: [recipientEmail],
      subject: `Parking Receipt - ${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Parking Receipt</h1>
          <p>Dear ${booking.user_name},</p>
          <p>Thank you for using our Smart Parking System. Please find your parking receipt attached as a PDF.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #666;">Booking Summary</h2>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Spot Number:</strong> ${spot.spot_number}</p>
            <p><strong>Amount Paid:</strong> ₹${booking.payment_amount}</p>
            <p><strong>Entry Time:</strong> ${new Date(booking.entry_time).toLocaleString()}</p>
          </div>
          
          <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
            This is an automated email. Please do not reply.
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
