import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Package } from 'lucide-react';
import { useLogin } from '@features/auth/hooks/useAuth';
import Input from '@components/ui/Input/Input';
import Button from '@components/ui/Button/Button';
import { ROUTES } from '@utils/constants';
import styles from './Auth.module.css';

const schema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => login(data);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoMark}>
            <Package size={28} strokeWidth={2.5} />
          </div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your Meet Mobile account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <Input
            id="login-identifier"
            label="Email or Username"
            placeholder="you@example.com"
            leadingIcon={Mail}
            error={errors.identifier?.message}
            {...register('identifier')}
          />
          <Input
            id="login-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            leadingIcon={Lock}
            trailingIcon={showPassword ? EyeOff : Eye}
            onTrailingIconClick={() => setShowPassword((v) => !v)}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" fullWidth size="lg" isLoading={isPending} id="login-submit-btn">
            Sign In
          </Button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.REGISTER} className={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
