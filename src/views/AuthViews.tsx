import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import {
  Utensils,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Building2,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  X,
  HardDrive,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface AuthViewsProps {
  mode: 'login' | 'register';
  defaultRole?: UserRole;
  onSuccess: (user: User) => void;
  onNavigate: (view: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface SavedLocalAccount {
  email: string;
  fullName: string;
  role: UserRole;
  lastUsed?: string;
}

const LOCAL_STORAGE_REGISTRY_KEY = 'foodshare_local_accounts_registry';
const LOCAL_STORAGE_ACTIVE_CRED_KEY = 'foodshare_saved_credentials';

export const AuthViews: React.FC<AuthViewsProps> = ({
  mode,
  defaultRole = 'provider',
  onSuccess,
  onNavigate,
  onShowToast,
}) => {
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [definedRole, setDefinedRole] = useState<UserRole>('provider');
  const [saveToLocalSystem, setSaveToLocalSystem] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [roleMismatchError, setRoleMismatchError] = useState<string | null>(null);

  // Locally Saved Accounts on device
  const [savedLocalAccounts, setSavedLocalAccounts] = useState<SavedLocalAccount[]>([]);

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>(defaultRole === 'admin' ? 'provider' : defaultRole);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  // On mount, load local system saved accounts
  useEffect(() => {
    loadLocalAccounts();
  }, []);

  const loadLocalAccounts = () => {
    try {
      const rawRegistry = localStorage.getItem(LOCAL_STORAGE_REGISTRY_KEY);
      if (rawRegistry) {
        const parsed: SavedLocalAccount[] = JSON.parse(rawRegistry);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedLocalAccounts(parsed);
          // If no email is typed yet, prefill latest used
          const latest = parsed[0];
          if (latest && !loginEmail) {
            setLoginEmail(latest.email);
            setDefinedRole(latest.role);
          }
        }
      }

      // Check active remembered credentials
      const savedCred = localStorage.getItem(LOCAL_STORAGE_ACTIVE_CRED_KEY);
      if (savedCred) {
        const parsed = JSON.parse(savedCred);
        if (parsed.email) setLoginEmail(parsed.email);
        if (parsed.role) setDefinedRole(parsed.role);
      }
    } catch (e) {
      console.warn('Error reading local system credentials:', e);
    }
  };

  const saveAccountToLocalRegistry = (user: User) => {
    try {
      const rawRegistry = localStorage.getItem(LOCAL_STORAGE_REGISTRY_KEY);
      let registry: SavedLocalAccount[] = rawRegistry ? JSON.parse(rawRegistry) : [];
      if (!Array.isArray(registry)) registry = [];

      // Filter out existing by email
      registry = registry.filter((acc) => acc.email.toLowerCase() !== user.email.toLowerCase());

      // Add to front
      registry.unshift({
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        lastUsed: new Date().toISOString(),
      });

      localStorage.setItem(LOCAL_STORAGE_REGISTRY_KEY, JSON.stringify(registry.slice(0, 8)));
      setSavedLocalAccounts(registry);

      if (saveToLocalSystem) {
        localStorage.setItem(
          LOCAL_STORAGE_ACTIVE_CRED_KEY,
          JSON.stringify({ email: user.email, role: user.role })
        );
        localStorage.setItem('foodshare_local_user', JSON.stringify(user));
      }
    } catch (e) {
      console.warn('Failed to save account to local registry:', e);
    }
  };

  const removeLocalAccount = (e: React.MouseEvent, targetEmail: string) => {
    e.stopPropagation();
    try {
      const updated = savedLocalAccounts.filter(
        (acc) => acc.email.toLowerCase() !== targetEmail.toLowerCase()
      );
      setSavedLocalAccounts(updated);
      localStorage.setItem(LOCAL_STORAGE_REGISTRY_KEY, JSON.stringify(updated));

      if (loginEmail.toLowerCase() === targetEmail.toLowerCase()) {
        localStorage.removeItem(LOCAL_STORAGE_ACTIVE_CRED_KEY);
        setLoginEmail('');
      }
      onShowToast(`Removed ${targetEmail} from local device registry`, 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const selectSavedAccount = (acc: SavedLocalAccount) => {
    setLoginEmail(acc.email);
    setDefinedRole(acc.role);
    setRoleMismatchError(null);
  };

  // Login handler with role definition & matching
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setRoleMismatchError(null);

    const emailTrimmed = loginEmail.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailTrimmed,
          password: loginPassword,
          role: definedRole, // Pass the role defined by user to match against stored credentials
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.error?.includes('Role Mismatch')) {
          setRoleMismatchError(data.error);
        }
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      // Role matched and credentials verified! Save data on local system
      saveAccountToLocalRegistry(data.user);

      onShowToast(
        `Credentials & Role verified successfully! Welcome back, ${data.user.fullName}.`,
        'success'
      );
      onSuccess(data.user);
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  // Registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      onShowToast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      onShowToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setRegisterLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          role: registerRole,
          organizationName: registerRole === 'volunteer' ? undefined : organizationName.trim(),
          organizationType: registerRole === 'volunteer' ? undefined : organizationType.trim(),
          city: city.trim() || undefined,
          postalCode: postalCode.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Save credentials and role to local system storage
      saveAccountToLocalRegistry(data.user);

      onShowToast(
        `Account created and saved to local system! Registered role: ${data.user.role.toUpperCase()}`,
        'success'
      );
      onSuccess(data.user);
    } catch (err: any) {
      onShowToast(err.message, 'error');
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase() }),
      });
      const data = await res.json();
      setForgotNotice(data.devTokenNotice || data.message);
    } catch (err: any) {
      onShowToast('Error requesting password reset', 'error');
    }
  };

  const rolesConfig: { id: UserRole; label: string; desc: string }[] = [
    { id: 'provider', label: 'Food Provider', desc: 'Restaurants, caterers, canteens & supermarkets' },
    { id: 'ngo', label: 'NGO / Shelter', desc: 'Food banks, community kitchens & welfare bodies' },
    { id: 'volunteer', label: 'Volunteer', desc: 'Surplus food collection & direct delivery' },
    { id: 'admin', label: 'Admin', desc: 'Platform moderator & credential verification' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-[#D6E4DC] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Informational & Local System Accounts Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#064C33] to-[#168052] p-8 text-white flex flex-col justify-between">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-5">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Food Share</h2>
            <p className="text-xs text-emerald-100 leading-relaxed font-semibold">
              Reduce Waste, Feed Need
            </p>
            <p className="text-xs text-white/80 mt-3 leading-relaxed">
              Every participant operates under a designated, verified role. When logging in, select your registered role; authentication guarantees role and credential integrity before granting access.
            </p>
          </div>

          {/* Local System Accounts Card */}
          <div className="mt-8 pt-6 border-t border-emerald-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-emerald-300" />
                <span>Local Device Registry</span>
              </span>
              <span className="text-[10px] text-emerald-300/80">
                {savedLocalAccounts.length} saved
              </span>
            </div>

            {savedLocalAccounts.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {savedLocalAccounts.map((acc) => (
                  <div
                    key={acc.email}
                    onClick={() => selectSavedAccount(acc)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      loginEmail.toLowerCase() === acc.email.toLowerCase() && definedRole === acc.role
                        ? 'bg-white/20 border-white text-white shadow-xs'
                        : 'bg-white/10 border-white/15 hover:bg-white/15 text-emerald-50'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold truncate leading-tight">{acc.fullName}</p>
                      <p className="text-[10px] text-emerald-200/90 truncate">{acc.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-white/20 text-white">
                        {acc.role}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => removeLocalAccount(e, acc.email)}
                        className="p-1 hover:text-rose-300 text-white/60 transition-colors"
                        title="Remove from local memory"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white/10 text-[11px] text-emerald-100/90 leading-relaxed border border-white/10">
                No accounts registered yet on this device. Create an account below to save your credentials and defined role to your local system!
              </div>
            )}
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-10">
          {mode === 'login' ? (
            /* Login Form with Role Definition & Verification */
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-[#183B2C]">Sign In to Portal</h1>
                <p className="text-xs text-[#61766D] mt-1">
                  Enter your credentials and define your role. Successful sign-in requires both credential and role verification.
                </p>
              </div>

              {/* Role Mismatch Error Notice */}
              {roleMismatchError && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Role Verification Failed</strong>
                    <span>{roleMismatchError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {/* 1. Define Account Role */}
                <div>
                  <label className="block text-xs font-bold text-[#183B2C] mb-1.5 flex items-center justify-between">
                    <span>1. Defined Role *</span>
                    <span className="text-[10px] text-[#61766D]">Matched with credentials</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {rolesConfig.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setDefinedRole(r.id);
                          setRoleMismatchError(null);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          definedRole === r.id
                            ? 'bg-[#EDF9F1] text-[#075C3C] border-[#168052] ring-1 ring-[#168052]'
                            : 'bg-white text-[#61766D] border-[#D6E4DC] hover:bg-[#F5F9F6]'
                        }`}
                      >
                        <span className="block text-xs font-bold text-[#183B2C]">{r.label}</span>
                        <span className="block text-[10px] text-[#61766D] truncate">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Email Address */}
                <div>
                  <label className="block text-xs font-bold text-[#183B2C] mb-1">
                    2. Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. user@domain.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C] focus:ring-2 focus:ring-[#168052]/20 focus:border-[#168052]"
                    />
                  </div>
                </div>

                {/* 3. Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#183B2C]">3. Password *</label>
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-[11px] font-semibold text-[#168052] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C] focus:ring-2 focus:ring-[#168052]/20 focus:border-[#168052]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember / Save Credentials on Local System */}
                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#183B2C] font-medium">
                    <input
                      type="checkbox"
                      checked={saveToLocalSystem}
                      onChange={(e) => setSaveToLocalSystem(e.target.checked)}
                      className="w-4 h-4 rounded text-[#168052] focus:ring-[#168052]"
                    />
                    <span>Save credentials to local system storage</span>
                  </label>
                </div>

                {/* Submit Verification */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <span>{loginLoading ? 'Verifying Credentials & Role...' : 'Verify Role & Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#D6E4DC] text-center text-xs text-[#61766D]">
                Don't have an account yet?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-[#168052] font-bold hover:underline"
                >
                  Register new account
                </button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-[#183B2C]">Register Account</h1>
                <p className="text-xs text-[#61766D] mt-1">
                  Fill in your details. Your account and chosen role will be saved to the local system database.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#183B2C] mb-1.5">
                    Select Account Role *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegisterRole('provider')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        registerRole === 'provider'
                          ? 'border-[#168052] bg-[#EDF9F1] text-[#075C3C]'
                          : 'border-[#D6E4DC] text-[#61766D] hover:bg-gray-50'
                      }`}
                    >
                      Food Provider
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole('ngo')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        registerRole === 'ngo'
                          ? 'border-[#168052] bg-[#EDF9F1] text-[#075C3C]'
                          : 'border-[#D6E4DC] text-[#61766D] hover:bg-gray-50'
                      }`}
                    >
                      NGO / Shelter
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterRole('volunteer')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        registerRole === 'volunteer'
                          ? 'border-[#168052] bg-[#EDF9F1] text-[#075C3C]'
                          : 'border-[#D6E4DC] text-[#61766D] hover:bg-gray-50'
                      }`}
                    >
                      Volunteer
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#183B2C] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#183B2C] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 555-0199"
                      className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#183B2C] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                  />
                </div>

                {registerRole !== 'volunteer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#183B2C] mb-1">
                        Organization Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder={
                          registerRole === 'provider'
                            ? 'e.g. Green Leaf Cafe'
                            : 'e.g. Hope Mission Food Bank'
                        }
                        className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#183B2C] mb-1">
                        Organization Type
                      </label>
                      <input
                        type="text"
                        value={organizationType}
                        onChange={(e) => setOrganizationType(e.target.value)}
                        placeholder="e.g. Restaurant, Bakery, Shelter"
                        className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#183B2C] mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Seattle"
                      className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#183B2C] mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 98101"
                      className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#183B2C] mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#183B2C] mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs text-[#183B2C]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={registerLoading}
                  className="w-full py-3 rounded-xl bg-[#168052] text-white text-xs font-bold hover:bg-[#075C3C] shadow-md transition-all mt-4 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{registerLoading ? 'Saving Credentials...' : 'Create Account & Save to System'}</span>
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-[#D6E4DC] text-center text-xs text-[#61766D]">
                Already have an account?{' '}
                <button
                  onClick={() => onNavigate('login')}
                  className="text-[#168052] font-bold hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#D6E4DC]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6E4DC] mb-4">
              <h3 className="font-bold text-sm text-[#183B2C] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#168052]" />
                <span>Password Reset</span>
              </h3>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#183B2C] mb-1">
                  Enter your registered email
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full p-2.5 rounded-xl border border-[#D6E4DC] text-xs"
                />
              </div>

              {forgotNotice && (
                <div className="p-3 bg-[#EDF9F1] rounded-xl border border-[#D6E4DC] text-xs text-[#075C3C] leading-relaxed">
                  {forgotNotice}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#D6E4DC]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#168052] text-white"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
