import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, AtSign, Eye, EyeOff, Package } from 'lucide-react';
import { useRegister } from '@features/auth/hooks/useAuth';
import Input from '@components/ui/Input/Input';
import Button from '@components/ui/Button/Button';
import { ROUTES } from '@utils/constants';
import styles from './Auth.module.css';

const schema = z.object({
  name:     z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers and underscores'),
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signup, isPending } = useRegister();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => signup(data);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logoMark}>
            <Package size={28} strokeWidth={2.5} />
          </div>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Join thousands of happy shoppers</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <Input
            id="register-name"
            label="Full Name"
            placeholder="John Doe"
            leadingIcon={User}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            id="register-username"
            label="Username"
            placeholder="johndoe"
            leadingIcon={AtSign}
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            id="register-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            leadingIcon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            id="register-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 6 characters"
            leadingIcon={Lock}
            trailingIcon={showPassword ? EyeOff : Eye}
            onTrailingIconClick={() => setShowPassword((v) => !v)}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" fullWidth size="lg" isLoading={isPending} id="register-submit-btn">
            Create Account
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
