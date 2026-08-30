import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Shield,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { User as UserType } from '../types';
import { INITIAL_USERS } from '../data/initialData';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { FreedomLogo } from './FreedomLogo';

interface LoginViewProps {
  onLoginSuccess: (user: UserType, dualLogin?: boolean) => void;
  onGoToPublicSite: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onGoToPublicSite }) => {
  const { t, language } = useLanguage();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'warning' | 'success' } | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setAlert(null);
  };

  const triggerAlert = (message: string, type: 'error' | 'warning' | 'success' = 'error') => {
    setAlert({ message, type });
    if (type === 'error') {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      triggerAlert(
        language === 'th'
          ? 'กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน'
          : 'Please enter both username and password',
        'warning'
      );
      return;
    }

    setIsLoading(true);
    setAlert(null);

    await new Promise((resolve) => setTimeout(resolve, 450));

    const foundUser = INITIAL_USERS.find(
      (u) => u.username.toLowerCase() === trimmedUser.toLowerCase() && u.password === password
    );

    if (foundUser) {
      triggerAlert(
        language === 'th'
          ? `เข้าสู่ระบบสำเร็จในฐานะ [${foundUser.name}] กำลังนำไปยังหน้าจัดการ...`
          : `Signed in as [${foundUser.name}]! Redirecting...`,
        'success'
      );
      const loggedInUser: UserType = {
        ...foundUser,
        loginTime: new Date().toISOString(),
      };

      setTimeout(() => {
        onLoginSuccess(loggedInUser, false);
      }, 550);
    } else {
      triggerAlert(
        language === 'th'
          ? 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาเลือกบัญชีทดสอบด้านล่างหรือกรอกใหม่'
          : 'Invalid username or password. Please select from the ready accounts below.',
        'error'
      );
      setIsLoading(false);
    }
  };

  const handleDualLogin = async () => {
    setIsLoading(true);
    setAlert(null);

    await new Promise((resolve) => setTimeout(resolve, 450));

    triggerAlert(
      language === 'th'
        ? 'เปิดใช้งาน Concurrent Dual-Session ทั้ง 2 บัญชี (admin + staff) สำเร็จ!'
        : 'Dual-Session Mode Activated (admin + staff)!',
      'success'
    );

    setTimeout(() => {
      onLoginSuccess(INITIAL_USERS[0], true);
    }, 600);
  };

  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden selection:bg-[#E50914] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E50914]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top right language switcher */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-6 fade-in flex flex-col items-center">
          <FreedomLogo size="xl" variant="full" showAdminBadge={true} className="mb-2" />
          <p className="text-gray-400 mt-1 text-sm">
            {language === 'th' ? 'ระบบจัดการภาพยนตร์และสตรีมมิ่ง — เข้าสู่ระบบ' : 'Cinema & Streaming Management — Sign In'}
          </p>
        </div>

        {/* Login Card */}
        <div
          id="loginBox"
          className={`bg-[#1A1A1A] rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 ${
            isShaking ? 'shake ring-2 ring-red-500' : ''
          }`}
        >
          {/* Notification Alert Box */}
          {alert && (
            <div
              id="alertBox"
              className={`mb-5 p-3 rounded-lg text-center text-xs sm:text-sm font-medium transition-all ${
                alert.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : alert.type === 'warning'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {alert.message}
            </div>
          )}

          <form id="loginForm" onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  {language === 'th' ? 'ชื่อผู้ใช้' : 'Username'}
                </span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914] transition-all font-mono"
                placeholder={language === 'th' ? 'กรอกชื่อผู้ใช้' : 'Enter username'}
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  {language === 'th' ? 'รหัสผ่าน' : 'Password'}
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914] transition-all pr-12 font-mono"
                  placeholder={language === 'th' ? 'กรอกรหัสผ่าน' : 'Enter password'}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  id="togglePass"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                  title={showPassword ? (language === 'th' ? 'ซ่อนรหัสผ่าน' : 'Hide password') : (language === 'th' ? 'แสดงรหัสผ่าน' : 'Show password')}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-[#0F0F0F] text-[#E50914] focus:ring-[#E50914]/50 accent-[#E50914]"
                />
                <span>{language === 'th' ? 'จดจำฉันไว้' : 'Remember me'}</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  triggerAlert(
                    language === 'th'
                      ? 'ระบบได้ส่งคำแนะนำรีเซ็ตรหัสผ่านไปยังอีเมลผู้ดูแลระบบแล้ว'
                      : 'Password reset instructions sent to admin email.',
                    'warning'
                  )
                }
                className="text-[#E50914] hover:text-[#ff3b47] transition-colors text-xs sm:text-sm font-medium cursor-pointer"
              >
                {language === 'th' ? 'ลืมรหัสผ่าน?' : 'Forgot Password?'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="loginBtn"
              disabled={isLoading}
              className="w-full bg-[#E50914] hover:bg-[#E50914]/90 disabled:opacity-75 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#E50914]/20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span>{language === 'th' ? 'กำลังตรวจสอบ...' : 'Authenticating...'}</span>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  <span id="btnText">{language === 'th' ? 'เข้าสู่ระบบ (Sign In)' : 'Sign In'}</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Concurrent Dual-User Session Login Feature */}
          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
            <button
              type="button"
              onClick={handleDualLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-emerald-600/20 via-emerald-500/20 to-blue-600/20 hover:from-emerald-600/30 hover:to-blue-600/30 border border-emerald-500/40 text-white transition flex items-center justify-between text-xs font-semibold shadow-md cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span className="text-emerald-300">
                  {language === 'th' ? 'เข้าใช้งานพร้อมกัน 2 ยูสเซอร์เนม (Dual Session)' : 'Login Both Accounts (Dual Session)'}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                admin + staff
              </span>
            </button>

            {/* Quick 2 Single Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Account 1: Super Admin */}
              <button
                type="button"
                onClick={() => fillCredentials('admin', 'Admin123')}
                className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between cursor-pointer ${
                  username === 'admin'
                    ? 'bg-[#E50914]/15 border-[#E50914]/50 text-white shadow-md'
                    : 'bg-[#0F0F0F] border-white/10 hover:border-white/25 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs flex items-center gap-1 text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E50914]" />
                    admin
                  </span>
                  <span className="text-[10px] bg-[#E50914]/20 text-[#E50914] px-1.5 py-0.5 rounded font-mono font-bold">
                    ADMIN
                  </span>
                </div>
                <div className="text-[11px] font-mono text-gray-400">
                  <div>Pass: <span className="text-white font-semibold">Admin123</span></div>
                </div>
              </button>

              {/* Account 2: Staff */}
              <button
                type="button"
                onClick={() => fillCredentials('staff', 'Staff456')}
                className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between cursor-pointer ${
                  username === 'staff'
                    ? 'bg-blue-500/15 border-blue-500/50 text-white shadow-md'
                    : 'bg-[#0F0F0F] border-white/10 hover:border-white/25 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-xs flex items-center gap-1 text-white">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    staff
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    STAFF
                  </span>
                </div>
                <div className="text-[11px] font-mono text-gray-400">
                  <div>Pass: <span className="text-white font-semibold">Staff456</span></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Public Preview Website */}
        <p className="text-center text-sm text-gray-500 mt-5">
          <button
            onClick={onGoToPublicSite}
            className="hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.header.previewSite}
          </button>
        </p>
      </div>
    </div>
  );
};
