import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '@services/auth.service';
import { useAuthStore } from '@store/authStore';
import { ROUTES } from '@utils/constants';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data);
      toast.success(`Welcome back, ${data.user.name}!`);
      // Redirect admins to dashboard, customers to home
      navigate(data.user.role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.HOME);
    },
    onError: (err) => {
      toast.error(err.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      setAuth(data);
      toast.success(`Welcome to ShopVault, ${data.user.name}!`);
      navigate(ROUTES.HOME);
    },
    onError: (err) => {
      toast.error(err.message || 'Registration failed');
    },
  });
};
