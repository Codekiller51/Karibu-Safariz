import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, admin } from '../lib/supabase';
import { LoginFormData } from '../lib/validationSchemas';

interface UseLoginOptions {
  redirectPath: string;
  isAdmin?: boolean;
}

export const useLogin = (options: UseLoginOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (options.isAdmin) {
        const isAdmin = await admin.checkAdminStatus();

        if (!isAdmin) {
          await supabase.auth.signOut();
          setError('You do not have administrator privileges');
          return;
        }
      }

      navigate(options.redirectPath);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, error, setError };
};
