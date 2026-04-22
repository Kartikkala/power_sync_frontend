import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Zap,
  Mail,
  User,
  Phone,
  Lock,
  CheckCircle2,
  XCircle,
  Loader2,
  Building2,
  DoorOpen,
  ArrowRight,
} from 'lucide-react';
import { verifyInvite, registerTenant, loginAsync } from '../store/authSlice';

export default function TenantOnboardingPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // States
  const [step, setStep] = useState('verifying'); // verifying | valid | invalid | form | success
  const [inviteInfo, setInviteInfo] = useState(null);
  const [error, setError] = useState('');

  // Form
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!code) {
      setStep('invalid');
      setError('No invitation code provided. Please check your email for the correct link.');
      return;
    }

    dispatch(verifyInvite(code))
      .unwrap()
      .then((data) => {
        setInviteInfo(data);
        setEmail(data.email || '');
        setStep('valid');
      })
      .catch((err) => {
        setStep('invalid');
        setError(typeof err === 'string' ? err : 'This invitation link is invalid or has expired.');
      });
  }, [code, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await dispatch(registerTenant({
        inviteCode: code,
        email,
        fullname,
        contactNo,
        password,
      })).unwrap();

      setStep('success');

      // Auto-login after 2 seconds
      setTimeout(async () => {
        try {
          await dispatch(loginAsync({ email, passwordHash: password })).unwrap();
          navigate('/');
        } catch {
          navigate('/auth');
        }
      }, 2000);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#0f9d78]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#f97316]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#0f9d78] flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-[#0f9d78]/30">
            <Zap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">PowerSync</h1>
          <p className="text-slate-400 mt-1 text-sm">Tenant Onboarding</p>
        </div>

        {/* Verifying State */}
        {step === 'verifying' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
            <Loader2 className="w-10 h-10 text-[#0f9d78] mx-auto mb-4 animate-spin" />
            <h2 className="text-lg font-semibold text-white mb-2">Validating Invitation</h2>
            <p className="text-slate-400 text-sm">Please wait while we verify your invitation code...</p>
          </div>
        )}

        {/* Invalid State */}
        {step === 'invalid' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Invalid Invitation</h2>
            <p className="text-slate-400 text-sm mb-6">{error}</p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Go to Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Valid — Show invite details + proceed */}
        {step === 'valid' && inviteInfo && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#0f9d78]/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-[#0f9d78]" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">You're Invited!</h2>
              <p className="text-slate-400 text-sm">Your landlord has invited you to join their property.</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <Building2 className="w-5 h-5 text-[#f97316]" />
                <div>
                  <p className="text-xs text-slate-400">Landlord</p>
                  <p className="text-white font-medium">{inviteInfo.landlordName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <DoorOpen className="w-5 h-5 text-[#0f9d78]" />
                <div>
                  <p className="text-xs text-slate-400">Assigned Room</p>
                  <p className="text-white font-medium">Room {inviteInfo.roomNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Invited Email</p>
                  <p className="text-white font-medium">{inviteInfo.email}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('form')}
              className="w-full py-3 bg-[#0f9d78] hover:bg-[#0d8a6a] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#0f9d78]/20 flex items-center justify-center gap-2"
            >
              Complete Registration
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Registration Form */}
        {step === 'form' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-white mb-1">Create Your Account</h2>
              <p className="text-slate-400 text-sm">Fill in your details to complete onboarding</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#0f9d78] focus:ring-1 focus:ring-[#0f9d78] transition-all"
                  />
                </div>
              </div>

              {/* Email (pre-filled, read-only) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Must match the invited email address</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#0f9d78] focus:ring-1 focus:ring-[#0f9d78] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#0f9d78] focus:ring-1 focus:ring-[#0f9d78] transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#0f9d78] focus:ring-1 focus:ring-[#0f9d78] transition-all"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#0f9d78] hover:bg-[#0d8a6a] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#0f9d78]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => setStep('valid')}
              className="w-full mt-3 text-sm text-slate-400 hover:text-white transition-colors text-center"
            >
              ← Back to invite details
            </button>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0f9d78]/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#0f9d78]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome to PowerSync!</h2>
            <p className="text-slate-400 text-sm mb-2">
              Your account has been created and you've been linked to your room.
            </p>
            <p className="text-slate-500 text-xs">Logging you in automatically...</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Already have an account?{' '}
          <Link to="/auth" className="text-[#0f9d78] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
