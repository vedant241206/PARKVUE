import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const AdminLogin = ({ onSuccess, onBack }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Check admin credentials and create session
    if (email.endsWith('@somaiya.edu') && password === 'admin@DASH') {
      try {
        // Create admin session in database
        const { data, error } = await supabase.rpc('create_admin_session', {
          admin_email: email,
          admin_password: password
        });

        const result = data as { success: boolean; session_token?: string; error?: string };

        if (error || !result.success) {
          throw new Error('Failed to create admin session');
        }

        // Store session token
        localStorage.setItem('admin_session_token', result.session_token!);
        
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin dashboard"
        });
        onSuccess();
      } catch (error) {
        toast({
          title: "Access Denied",
          description: "Failed to authenticate admin",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Admin Access
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your admin credentials to continue
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={onBack} 
                className="flex-1"
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handleLogin} 
                className="flex-1"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? 'Verifying...' : 'Access Dashboard'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};