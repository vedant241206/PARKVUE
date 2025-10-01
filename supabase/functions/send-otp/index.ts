import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber } = await req.json();
    
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    const MTALKZ_API_KEY = Deno.env.get('MTALKZ_API_KEY');
    
    if (!MTALKZ_API_KEY) {
      throw new Error('MTALKZ_API_KEY not configured');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send OTP via MTALKZ API
    // Format: https://api.mtalkz.com/api/v1/send-otp
    const mtalkzResponse = await fetch('https://api.mtalkz.com/api/v1/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MTALKZ_API_KEY}`
      },
      body: JSON.stringify({
        phone: phoneNumber,
        otp: otp,
        template_id: 'OTP_TEMPLATE', // You may need to configure this in MTALKZ
      })
    });

    const mtalkzData = await mtalkzResponse.json();
    
    if (!mtalkzResponse.ok) {
      console.error('MTALKZ API Error:', mtalkzData);
      throw new Error(mtalkzData.message || 'Failed to send OTP');
    }

    console.log('OTP sent successfully to:', phoneNumber);
    
    // Store OTP temporarily (in production, use Redis or similar)
    // For now, we'll return the OTP hash for verification
    // Note: In production, store this in a database with expiry
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // In production, don't send OTP back, use session/hash
        otpHash: btoa(otp) // Base64 encode for simple verification
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
