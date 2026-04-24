import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api';

const initialLogin = { email: '', password: '', rememberMe: true };
const initialSignup = { fullName: '', email: '', password: '' };

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [signupForm, setSignupForm] = useState(initialSignup);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedMode = params.get('mode');

    if (requestedMode === 'signup' || requestedMode === 'login') {
      setMode(requestedMode);
      setError('');
      setSuccessMessage('');
    }
  }, [location.search]);

  function updateForm(key, value) {
    if (mode === 'login') {
      setLoginForm((current) => ({ ...current, [key]: value }));
      return;
    }

    setSignupForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (mode === 'login') {
      if (!loginForm.email.trim()) {
        setError('Email is required.');
        setLoading(false);
        return;
      }

      if (!loginForm.password) {
        setError('Password is required.');
        setLoading(false);
        return;
      }
    } else if (!signupForm.fullName.trim() || !signupForm.email.trim() || !signupForm.password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup';
      const payload =
        mode === 'login'
          ? { email: loginForm.email, password: loginForm.password }
          : signupForm;
      const { data } = await api.post(endpoint, payload);

      signIn(data.token, data.user, loginForm.rememberMe);
      setSuccessMessage(mode === 'login' ? 'Login successful, redirecting...' : 'Account created, redirecting...');

      window.setTimeout(() => {
        navigate('/', { replace: true });
      }, 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to continue. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#edf6ff_0%,#dbeeff_48%,#e9f4ff_100%)] px-6 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/88 p-10 shadow-[0_24px_60px_rgba(37,99,235,0.12)] backdrop-blur">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            Resume Builder
          </span>
          <h1 className="mt-7 max-w-2xl text-3xl md:text-4xl font-extrabold leading-tight text-slate-900">
            Build a professional resume after a secure sign in.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Create your account, verify your email and password, and continue into the builder with a protected workspace.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-blue-700">Secure Access</h3>
              <p className="mt-3 text-[1.02rem] leading-8 text-slate-600">Only signed-in users can open the resume builder and save resume data.</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-blue-700">Quick Start</h3>
              <p className="mt-3 text-[1.02rem] leading-8 text-slate-600">Use sign up for new users or sign in if you already have an account.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/75 bg-white/95 p-8 shadow-[0_24px_60px_rgba(37,99,235,0.12)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Access Workspace</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-slate-600">
              {mode === 'login' ? 'Sign in to your account.' : 'Sign up to start building your resume.'}
            </p>
          </div>

          <div className="mt-7 flex gap-3 rounded-2xl bg-slate-50 p-2">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-xl px-5 py-3 font-semibold transition ${mode === 'login' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-700 hover:bg-white'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-xl px-5 py-3 font-semibold transition ${mode === 'signup' ? 'bg-blue-600 text-white shadow-md' : 'text-blue-700 hover:bg-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {mode === 'signup' && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Full Name</span>
                <input
                  value={signupForm.fullName}
                  onChange={(event) => updateForm('fullName', event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email Address</span>
              <input
                type="email"
                value={mode === 'login' ? loginForm.email : signupForm.email}
                onChange={(event) => updateForm('email', event.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                value={mode === 'login' ? loginForm.password : signupForm.password}
                onChange={(event) => updateForm('password', event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            {mode === 'login' && (
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(event) => updateForm('rememberMe', event.target.checked)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  Remember Me
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMessage('Forgot password is not connected yet. Please sign up again or contact support.');
                  }}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
            {successMessage ? <p className="text-sm font-medium text-emerald-600">{successMessage}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 px-4 py-3.5 text-lg font-bold text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-600">
            {mode === 'login' ? 'New user?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-semibold text-blue-700"
            >
              {mode === 'login' ? 'Create Account' : 'Sign In'}
            </button>
          </p>

          <div className="mt-8 text-sm text-slate-500">
            <Link to="/" className="font-semibold text-blue-700">
              Back to home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
