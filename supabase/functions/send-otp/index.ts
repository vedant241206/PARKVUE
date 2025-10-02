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

    // DEVELOPMENT MODE: Use fixed OTP for testing
    // Change DEV_MODE to false when you have SMS configured
    const DEV_MODE = true;
    const otp = DEV_MODE ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Using fixed OTP 123456 for:', phoneNumber);
    } else {
      // Production: Send real SMS
      const FAST2SMS_API_KEY = Deno.env.get('FAST2SMS_API_KEY');
      
      if (!FAST2SMS_API_KEY) {
        throw new Error('FAST2SMS_API_KEY not configured');
      }

      const fast2smsResponse = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          sender_id: 'TXTIND',
          message: `Your OTP is ${otp}. Valid for 5 minutes.`,
          variables_values: otp,
          flash: 0,
          numbers: phoneNumber.replace(/\D/g, '')
        })
      });

      const fast2smsData = await fast2smsResponse.json();
      
      if (!fast2smsResponse.ok || !fast2smsData.return) {
        console.error('Fast2SMS API Error:', fast2smsData);
        throw new Error(fast2smsData.message || 'Failed to send OTP');
      }

      console.log('OTP sent successfully to:', phoneNumber, 'Response:', fast2smsData);
    }
    
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
