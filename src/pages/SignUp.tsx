import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    const error = await signUp(data.email, data.password);
    if (error) {
      setServerError(error.message);
      return;
    }
    navigate('/library');
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">

        {/* ── En-tête page de garde ── */}
        <div className="text-center mb-8">
          <p className="font-sans text-xs tracking-[0.5em] mb-5">
            <span className="text-ink-300">— </span>
            <span className="text-terra-500">✦</span>
            <span className="text-ink-300"> —</span>
          </p>
          <h1 className="font-serif text-3xl font-bold text-ink-900 tracking-[0.12em] mb-2">
            Bookshelf
          </h1>
          <p className="font-serif italic text-sm text-ink-400">
            Create your account
          </p>
        </div>

        {/* ── Citation ── */}
        <blockquote className="text-center mt-6 mb-8 px-2">
          <p className="font-serif italic text-sm text-ink-400 leading-relaxed">
            "There is no friend as loyal as a book."
          </p>
          <cite className="block mt-2 not-italic font-sans text-xs text-ink-300 tracking-widest uppercase">
            Ernest Hemingway
          </cite>
        </blockquote>

        {/* ── Filet ── */}
        <div className="border-t border-terra-200 mb-8" />

        {/* ── Formulaire ── */}
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
              autoComplete="new-password"
              className={`w-full rounded-lg border px-4 py-3 font-sans text-sm text-ink-900 bg-white placeholder:text-ink-300 outline-none transition-colors
                ${errors.password
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-ink-100 focus:border-terra-500'
                }`}
              placeholder="At least 8 characters"
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

          {/* Confirm password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="font-sans text-sm font-medium text-ink-700">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`w-full rounded-lg border px-4 py-3 font-sans text-sm text-ink-900 bg-white placeholder:text-ink-300 outline-none transition-colors
                ${errors.confirmPassword
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-ink-100 focus:border-terra-500'
                }`}
              placeholder="Repeat your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password.',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match.',
              })}
            />
            {errors.confirmPassword && (
              <p className="font-sans text-xs text-red-500">{errors.confirmPassword.message}</p>
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
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* ── Colophon ── */}
        <div className="border-t border-terra-200 mt-8 pt-6 flex flex-col items-center gap-2.5">
          <p className="font-sans text-xs text-ink-400">
            Already have an account?{' '}
            <Link to="/signin" className="text-terra-500 hover:text-terra-600 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* ── Ornement bas ── */}
        <p className="mt-6 font-sans text-xs tracking-[0.5em] text-center">
          <span className="text-ink-300">— </span>
          <span className="text-terra-500">✦</span>
          <span className="text-ink-300"> —</span>
        </p>

      </div>
    </div>
  );
}
