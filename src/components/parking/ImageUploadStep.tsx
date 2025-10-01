import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Camera, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadStepProps {
  onSuccess: (numberPlate: string) => void;
  onBack: () => void;
}

export const ImageUploadStep = ({ onSuccess, onBack }: ImageUploadStepProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedPlate, setDetectedPlate] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const extractNumberPlate = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      toast({
        title: "Processing Image",
        description: "AI is detecting the number plate..."
      });

      console.log('Calling detect-number-plate function...');

      const { data, error } = await supabase.functions.invoke('detect-number-plate', {
        body: { imageBase64: imageUrl }
      });

      if (error) {
        console.error('Function error:', error);
        throw new Error(error.message || 'Failed to detect number plate');
      }

      console.log('Detection response:', data);

      if (data.success && data.numberPlate) {
        setDetectedPlate(data.numberPlate);
        toast({
          title: "Number Plate Detected!",
          description: `Found: ${data.numberPlate}`
        });
      } else {
        throw new Error(data.error || 'Could not detect number plate');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      toast({
        title: "Detection Failed",
        description: error.message || "Could not detect number plate. You can enter it manually in the next step.",
        variant: "destructive"
      });
      setDetectedPlate('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);
        extractNumberPlate(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);
        extractNumberPlate(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleNext = () => {
    if (detectedPlate) {
      onSuccess(detectedPlate);
    } else if (uploadedImage) {
      // Allow to continue even without detection
      toast({
        title: "No plate detected",
        description: "You can enter the number plate manually in the next step",
      });
      onSuccess('');
    } else {
      toast({
        title: "No Image Uploaded",
        description: "Please upload a vehicle image first",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Camera className="h-6 w-6" />
            Upload Vehicle Image
          </CardTitle>
          <p className="text-muted-foreground">
            Upload a clear front view of your vehicle for automatic number plate detection
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Dropbox Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/5"
            >
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded vehicle"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Detecting number plate...</span>
                    </div>
                  ) : detectedPlate ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>Number plate detected!</span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      <p>Could not detect plate automatically</p>
                      <p className="text-sm">You can enter it manually in the next step</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Drop your image here or click to upload</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Detected Number Plate */}
            {detectedPlate && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Detected Number Plate:</p>
                <div className="bg-black text-yellow-400 font-bold text-2xl py-3 px-4 rounded text-center tracking-wider">
                  {detectedPlate}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  You can edit this in the next step if needed
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={isProcessing}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1"
                disabled={isProcessing || !uploadedImage}
              >
                {isProcessing ? 'Processing...' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
