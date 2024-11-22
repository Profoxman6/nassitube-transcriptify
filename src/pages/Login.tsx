import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-teal-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Nassi Tube</h2>
        <Auth 
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              button: {
                background: '#eab308',
                color: '#713f12',
                borderRadius: '0.375rem',
              },
              anchor: {
                color: '#854d0e',
              },
            },
          }}
          providers={[]}
          redirectTo={window.location.origin}
          onlyThirdPartyProviders={false}
          magicLink={false}
          showLinks={true}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;