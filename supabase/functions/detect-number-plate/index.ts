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
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error('Image data is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Detecting number plate using Gemini Vision...');

    // Use Gemini Vision API for number plate and vehicle type detection
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this vehicle image and extract: 1) The license/number plate text in capital letters with no spaces/hyphens (e.g., DL01AB1234), 2) The vehicle type (2wheeler for bike/scooter, 3wheeler for auto/rickshaw, 4wheeler for car/suv/truck). Return ONLY in this exact format: "NUMBERPLATE|VEHICLETYPE". Example: "MH12AB1234|4wheeler" or "DL01CD5678|2wheeler". If you cannot detect the plate or type, use "NOT_DETECTED" for that field.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      throw new Error('Failed to detect number plate');
    }

    const data = await response.json();
    const detectedText = data.choices[0].message.content.trim().toUpperCase();
    
    console.log('Detected text:', detectedText);

    // Parse the response format: "NUMBERPLATE|VEHICLETYPE"
    const parts = detectedText.split('|');
    let numberPlate = parts[0]?.replace(/[^A-Z0-9]/g, '') || 'NOT_DETECTED';
    let vehicleType = parts[1]?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    
    // Validate vehicle type
    const validTypes = ['2wheeler', '3wheeler', '4wheeler'];
    if (!validTypes.includes(vehicleType)) {
      vehicleType = '4wheeler'; // Default to 4wheeler if detection fails
    }
    
    if (numberPlate === 'NOT_DETECTED' || numberPlate.length < 6 || numberPlate.length > 15) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Could not detect a valid number plate',
          detectedText: numberPlate,
          vehicleType: vehicleType
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        numberPlate: numberPlate,
        vehicleType: vehicleType
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in detect-number-plate function:', error);
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
