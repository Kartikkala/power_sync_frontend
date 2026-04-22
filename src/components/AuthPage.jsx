import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Super simple mock logic: if email has 'admin', play as landlord, else tenant
    const role = email.includes('admin') ? 'landlord' : 'tenant';
    dispatch(login({ email, role, name: isLogin ? 'Welcome Back' : 'New Partner' }));
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-orange/20 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-card rounded-3xl shadow-2xl border border-divider overflow-hidden z-10 m-4">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
          {/* Subtle overlay overlaying the gradient */}
          <div className="absolute inset-0 bg-black/10 z-0"></div>
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/50">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PowerSync Analytics</span>
          </div>

          <div className="relative z-10 space-y-6 max-w-md">
            <h1 className="text-4xl font-bold leading-tight">
              Manage your energy <br /> with intelligence.
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Join thousands of landlords experiencing unparalleled visibility into tenant energy consumption and billing.
            </p>
            
            {/* Quick Stats or Features */}
            <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <span className="text-sm font-medium text-slate-300">Real-time IoT Monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                </div>
                <span className="text-sm font-medium text-slate-300">Automated Billing & Invoices</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 text-sm text-slate-400">
            © 2026 PowerSync. All rights reserved.
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-card relative">
          
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center md:text-left transition-all duration-300">
              <h2 className="text-3xl font-bold text-text-primary tracking-tight">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-text-secondary mt-2">
                {isLogin ? 'Enter your details to access your dashboard.' : 'Start your 30-day free trial. No credit card required.'}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-3 duration-500">
                  <label className="text-sm font-medium text-text-primary">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5 pointer-events-none" />
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      className="w-full pl-11 pr-4 py-3 bg-bg border border-divider rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5 pointer-events-none" />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-bg border border-divider rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-primary">Password</label>
                  {isLogin && <a href="#" className="text-sm font-medium text-accent-primary hover:text-accent-primary-hover transition-colors">Forgot password?</a>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary w-5 h-5 pointer-events-none" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-4 py-3 bg-bg border border-divider rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 px-4 bg-accent-primary hover:bg-accent-primary-hover text-white font-medium rounded-xl shadow-lg shadow-accent-primary/25 transition-all flex items-center justify-center gap-2 group"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-divider"></div>
              <span className="flex-shrink-0 mx-4 text-text-tertiary text-sm">or continue with</span>
              <div className="flex-grow border-t border-divider"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-bg border border-divider hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-text-primary font-medium transition-colors shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-bg border border-divider hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-text-primary font-medium transition-colors shadow-sm">
                <Github className="w-5 h-5" />
                Github
              </button>
            </div>

            <p className="text-center text-sm text-text-secondary">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-accent-primary hover:text-accent-primary-hover transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
