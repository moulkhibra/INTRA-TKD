import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please enter email and password');
        setLoading(false);
        return;
      }

      // Simple email validation
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Login
      const success = login({
        email,
        password,
        name: name || email.split('@')[0]
      });

      if (success) {
        // Redirect to dashboard
        setTimeout(() => navigate('/'), 500);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    login({
      email: 'admin@tkd.local',
      password: 'demo123',
      name: 'Admin'
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🥋</div>
          <h1 className="text-4xl font-bold text-white mb-2">TKD-Manager</h1>
          <p className="text-red-100">Taekwondo Club Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center space-x-2">
            <LogIn size={24} className="text-red-600" />
            <span>Login</span>
          </h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 rounded mb-6">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Name Field (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Demo Login Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleDemoLogin}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Demo Login
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Click to login with demo credentials
            </p>
          </div>

          {/* Help Text */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-xs text-gray-600">
              <strong>Demo Account:</strong><br />
              Email: admin@tkd.local<br />
              Password: demo123
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm mt-8">
          © 2026 TKD-Manager. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
