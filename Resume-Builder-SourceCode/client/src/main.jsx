import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import './index.css';

import About from './pages/About.jsx';
import Auth from './pages/Auth.jsx';
import Builder from './pages/Builder.jsx';
import Contact from './pages/Contact.jsx';
import Features from './pages/Features.jsx';
import Home from './pages/Home.jsx';

function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between text-white">
        <Link to={user ? '/builder' : '/auth'} className="text-2xl font-bold">
          ResumeBuilder
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/builder" className="hover:underline">
            Builder
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/features" className="hover:underline">
            Features
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          {user ? (
            <>
              <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium">{user.fullName}</span>
              <button
                type="button"
                onClick={signOut}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="hover:underline">
                Sign In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProtectedRoute({ children }) {
  const { authReady, user } = useAuth();

  if (!authReady) {
    return <div className="grid min-h-screen place-items-center text-lg text-gray-600">Checking your account...</div>;
  }

  return user ? children : <Navigate to="/auth" replace />;
}

function PublicOnlyRoute({ children }) {
  const { authReady, user } = useAuth();

  if (!authReady) {
    return <div className="grid min-h-screen place-items-center text-lg text-gray-600">Checking your account...</div>;
  }

  return user ? <Navigate to="/" replace /> : children;
}

function AppRoutes() {
  const { authReady, user } = useAuth();

  if (!authReady) {
    return <div className="grid min-h-screen place-items-center text-lg text-gray-600">Checking your account...</div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/auth" replace />} />
        <Route
          path="/auth"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);
