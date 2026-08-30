import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Trash2,
  KeyRound,
  Check,
  Mail,
  ArrowLeftRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface UsersManagementProps {
  users: User[];
  currentUser: User | null;
  dualSessions: User[];
  onUpdateUsers: (users: User[]) => void;
  onSwitchUser: (user: User) => void;
  onToggleDualUser?: () => void;
  onSetDualSessions?: (sessions: User[]) => void;
}

export const UsersManagement: React.FC<UsersManagementProps> = ({
  users,
  currentUser,
  dualSessions,
  onUpdateUsers,
  onSwitchUser,
  onToggleDualUser,
  onSetDualSessions,
}) => {
  const { t, language } = useLanguage();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: username.trim().toLowerCase(),
      name: name.trim() || username.trim(),
      role,
      email: email.trim() || `${username}@freedom.com`,
      password: password.trim(),
      avatar:
        role === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    };

    onUpdateUsers([...users, newUser]);
    setUsername('');
    setName('');
    setPassword('');
    setEmail('');
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      alert(language === 'th' ? 'ไม่สามารถลบผู้ใช้งานทั้งหมดได้ ต้องมีอย่างน้อย 1 บัญชี' : 'Cannot delete all users, must keep at least 1 account.');
      return;
    }
    onUpdateUsers(users.filter((u) => u.id !== id));
  };

  const handleToggleDualSlot = (targetUser: User) => {
    if (!onSetDualSessions) return;
    const isAlreadyInDual = dualSessions.some((s) => s.id === targetUser.id);
    if (isAlreadyInDual) {
      if (dualSessions.length <= 1) {
        alert(language === 'th' ? 'ต้องมีอย่างน้อย 1 บัญชีในเซสชัน' : 'Must keep at least 1 session.');
        return;
      }
      const updated = dualSessions.filter((s) => s.id !== targetUser.id);
      onSetDualSessions(updated);
    } else {
      if (dualSessions.length >= 2) {
        // Replace the non-active one or add
        const currentActive = dualSessions.find((s) => s.id === currentUser?.id) || dualSessions[0];
        onSetDualSessions([currentActive, targetUser]);
      } else {
        onSetDualSessions([...dualSessions, targetUser]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Dual-Session Banner */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-[#E50914]" />
          <span>{t.users.pageTitle}</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">{t.users.pageSubtitle}</p>
      </div>

      {/* Concurrent Dual-User Session Info Banner */}
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#222] to-[#1A1A1A] border border-[#E50914]/30 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-[#E50914]/20 text-[#E50914] rounded-xl shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">
                  {language === 'th' ? 'ระบบ Concurrent Dual-User Session (สลับ 2 บัญชีพร้อมกัน)' : 'Concurrent Dual-User Session Mode'}
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {dualSessions.length}/2 ACTIVE
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                {language === 'th'
                  ? 'คุณสามารถล็อกอิน 2 บัญชี (Admin และ Staff) พร้อมกันในแถบด้านข้าง แล้วกดสลับไปมาระหว่างทำงานได้ทันทีด้วยปุ่มหรือคีย์ลัด Ctrl + U'
                  : 'Maintain 2 concurrent administrator/staff sessions in the sidebar dashboard with instant 1-click toggling or shortcut Ctrl + U.'}
              </p>
            </div>
          </div>

          {dualSessions.length > 1 && onToggleDualUser && (
            <button
              onClick={onToggleDualUser}
              className="bg-[#E50914] hover:bg-[#E50914]/90 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-[#E50914]/25 shrink-0 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>{language === 'th' ? 'สลับบัญชีผู้ใช้งานทันที (Ctrl+U)' : 'Toggle Active Session (Ctrl+U)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Create User & User Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add User Form */}
        <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 shadow-md">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#28A745]" />
            <span>{language === 'th' ? 'เพิ่มผู้ใช้งานใหม่' : 'Add New User'}</span>
          </h2>

          <form onSubmit={handleAddUser} className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {t.users.username} *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. moderator01"
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {t.users.fullName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'th' ? 'เช่น สมศักดิ์ ใจดี' : 'e.g. John Doe'}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {t.users.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@freedom.com"
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {language === 'th' ? 'รหัสผ่านเริ่มต้น *' : 'Password *'}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'th' ? 'กรอกรหัสผ่าน' : 'Enter password'}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {t.users.role}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              >
                <option value="admin">{t.users.roleAdmin}</option>
                <option value="staff">{t.users.roleStaff}</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.users.addUserBtn}</span>
            </button>
          </form>
        </div>

        {/* Users List Table */}
        <div className="lg:col-span-2 bg-[#1A1A1A] rounded-xl p-5 border border-white/5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">
              {language === 'th' ? `บัญชีผู้ใช้งานในระบบ (${users.length})` : `System User Accounts (${users.length})`}
            </h2>
            <span className="text-xs text-gray-400">
              {language === 'th' ? 'สามารถเลือกเข้าใช้งานใน Dual Session ได้สูงสุด 2 บัญชี' : 'Up to 2 concurrent active sessions'}
            </span>
          </div>

          <div className="space-y-3">
            {users.map((user) => {
              const isCurrent = currentUser?.username === user.username;
              const isInDual = dualSessions.some((s) => s.username === user.username);
              const isStandby = isInDual && !isCurrent;

              return (
                <div
                  key={user.id}
                  className={`p-4 bg-[#0F0F0F] rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                    isCurrent
                      ? 'border-[#E50914]/50 bg-[#E50914]/5 shadow-md'
                      : isStandby
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`w-11 h-11 rounded-full object-cover border ${
                          isCurrent ? 'border-[#E50914]' : isStandby ? 'border-blue-400' : 'border-white/10'
                        }`}
                      />
                      {isCurrent && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0F0F0F] rounded-full" />
                      )}
                      {isStandby && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-400 border-2 border-[#0F0F0F] rounded-full" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">{user.username}</span>
                        {isCurrent && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                            {language === 'th' ? 'กำลังใช้งาน (Active)' : 'Active Session'}
                          </span>
                        )}
                        {isStandby && (
                          <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                            {language === 'th' ? 'สแตนด์บาย (Standby)' : 'Dual Standby'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 font-sans">
                        {user.name} • <span className="font-mono text-gray-500">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
                    {/* Role badge */}
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 ${
                        user.role === 'admin'
                          ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {user.role === 'admin' ? (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Admin</span>
                        </>
                      ) : (
                        <>
                          <Shield className="w-3.5 h-3.5" />
                          <span>Staff</span>
                        </>
                      )}
                    </span>

                    {/* Switch / Activate session button */}
                    {!isCurrent && (
                      <button
                        onClick={() => onSwitchUser(user)}
                        className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition cursor-pointer font-medium flex items-center gap-1"
                        title="Switch active user to this account"
                      >
                        <ArrowLeftRight className="w-3 h-3 text-[#E50914]" />
                        <span>{language === 'th' ? 'สลับมาใช้บัญชีนี้' : 'Switch'}</span>
                      </button>
                    )}

                    {/* Delete user button */}
                    {!isCurrent && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
