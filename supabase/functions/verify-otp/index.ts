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
    const { phoneNumber, otp, otpHash } = await req.json();
    
    if (!phoneNumber || !otp || !otpHash) {
      throw new Error('Phone number, OTP, and OTP hash are required');
    }

    // Verify OTP against hash
    const expectedOtp = atob(otpHash);
    
    if (otp === expectedOtp) {
      console.log('OTP verified successfully for:', phoneNumber);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP verified successfully'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid OTP'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

  } catch (error) {
    console.error('Error in verify-otp function:', error);
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
