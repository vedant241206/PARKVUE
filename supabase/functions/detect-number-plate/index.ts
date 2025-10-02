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

    // Use Gemini Vision API for number plate detection
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
                text: 'Analyze this vehicle image and provide TWO things in this exact format:\n\nNUMBER_PLATE: [plate number]\nVEHICLE_TYPE: [type]\n\nFor NUMBER_PLATE: Extract the license plate text in capital letters with no spaces, hyphens, or special characters (e.g., DL01AB1234). If not detectable, write "NOT_DETECTED".\n\nFor VEHICLE_TYPE: Identify if this is a "2wheeler" (bike/scooter/motorcycle), "3wheeler" (auto-rickshaw), or "4wheeler" (car/SUV/van/truck). Return exactly one of these three values.'
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
    const detectedText = data.choices[0].message.content.trim();
    
    console.log('Detected text:', detectedText);

    // Parse the response
    const numberPlateMatch = detectedText.match(/NUMBER_PLATE:\s*([A-Z0-9]+)/i);
    const vehicleTypeMatch = detectedText.match(/VEHICLE_TYPE:\s*(2wheeler|3wheeler|4wheeler)/i);
    
    const numberPlate = numberPlateMatch ? numberPlateMatch[1].toUpperCase().replace(/[^A-Z0-9]/g, '') : 'NOT_DETECTED';
    const vehicleType = vehicleTypeMatch ? vehicleTypeMatch[1].toLowerCase() : '4wheeler';
    
    console.log('Parsed - Number Plate:', numberPlate, 'Vehicle Type:', vehicleType);

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
