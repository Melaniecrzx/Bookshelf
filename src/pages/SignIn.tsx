import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface FormValues {
  email: string;
  password: string;
}

export function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    const error = await signIn(data.email, data.password);
    if (error) {
      setServerError(error.message);
      return;
    }
    navigate('/library');
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">Sign in</h1>
        <p className="font-sans text-sm text-ink-400 mb-8">Welcome back to your library.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-sans text-sm font-medium text-ink-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`w-full rounded-lg border px-4 py-3 font-sans text-sm text-ink-900 bg-white placeholder:text-ink-300 outline-none transition-colors
                ${errors.email
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-ink-100 focus:border-terra-500'
                }`}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address.',
                },
              })}
            />
            {errors.email && (
              <p className="font-sans text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-sans text-sm font-medium text-ink-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`w-full rounded-lg border px-4 py-3 font-sans text-sm text-ink-900 bg-white placeholder:text-ink-300 outline-none transition-colors
                ${errors.password
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-ink-100 focus:border-terra-500'
                }`}
              placeholder="Your password"
              {...register('password', {
                required: 'Password is required.',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters.',
                },
              })}
            />
            {errors.password && (
              <p className="font-sans text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <p className="font-sans text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {serverError}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-terra-500 hover:bg-terra-600 disabled:opacity-60 px-4 py-3 font-sans text-sm font-semibold text-white transition-colors"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/library')}
            className="font-sans text-sm text-ink-400 hover:text-ink-700 transition-colors"
          >
            Continue as guest
          </button>
          <p className="font-sans text-sm text-ink-400">
            No account yet?{' '}
            <Link to="/signup" className="text-terra-500 hover:text-terra-600 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
