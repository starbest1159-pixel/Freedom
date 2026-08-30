import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Radio,
  Users,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Volume2,
  AlertCircle,
  Clock,
  Flame,
  Shield,
  Layers,
  Check,
  X,
  Share2,
} from 'lucide-react';
import { LiveStream, LiveNotification } from '../types';

interface LiveStreamNotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  stream: LiveStream | null;
  onSendNotification: (notification: LiveNotification) => void;
}

export const LiveStreamNotifyModal: React.FC<LiveStreamNotifyModalProps> = ({
  isOpen,
  onClose,
  stream,
  onSendNotification,
}) => {
  if (!isOpen || !stream) return null;

  const defaultTitle = `🔴 เริ่มถ่ายทอดสดแล้ว! ${stream.title}`;
  const defaultMessage = `⚽ ${stream.league} (${stream.homeTeam.name} พบ ${stream.awayTeam.name}) เปิดฉากแล้ว! รับชมสดแบบ 4K UHD 60FPS พากย์ไทย ไม่มีโฆษณากวนใจ`;

  const [title, setTitle] = useState(defaultTitle);
  const [message, setMessage] = useState(defaultMessage);
  const [targetAudience, setTargetAudience] = useState<'all' | 'vip' | 'followers'>('all');
  const [pushNotification, setPushNotification] = useState(true);
  const [inAppBanner, setInAppBanner] = useState(true);
  const [soundAlert, setSoundAlert] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    if (stream) {
      setTitle(`🔴 เริ่มถ่ายทอดสดแล้ว! ${stream.title}`);
      setMessage(
        `⚽ ${stream.league} (${stream.homeTeam.name} พบ ${stream.awayTeam.name}) เปิดฉากแล้ว! รับชมสดแบบ ${stream.resolution || '4K UHD'} พากย์ไทย สัญญาณสดคมชัด`
      );
      setSendSuccess(false);
      setIsSending(false);
    }
  }, [stream]);

  const audienceStats = {
    all: { label: 'ผู้ใช้งานทุกคนในระบบ (All Users)', count: 142500 },
    vip: { label: 'สมาชิก VIP & Premium เท่านั้น', count: 48200 },
    followers: {
      label: `แฟนคลับทีม (${stream.homeTeam.name} & ${stream.awayTeam.name})`,
      count: 36800,
    },
  };

  const currentAudience = audienceStats[targetAudience];

  const presets = [
    {
      id: 'start',
      label: '🔴 แมตช์เริ่มแข่งแล้ว (Live Now)',
      title: `🔴 เริ่มถ่ายทอดสดแล้ว! ${stream.title}`,
      message: `⚽ ศึกเดือด ${stream.league} (${stream.homeTeam.name} พบ ${stream.awayTeam.name}) เริ่มสตรีมแล้ว! คลิกเพื่อรับชมสดทันที`,
    },
    {
      id: 'countdown',
      label: '⏳ ใกล้เริ่มใน 15 นาที',
      title: `⏳ เตรียมตัวรับชม! ${stream.title} ในอีก 15 นาที`,
      message: `🏆 การแข่งขัน ${stream.league} กำลังจะเริ่มในเวลา ${stream.matchTime} ล็อกอินเข้าแอปพร้อมเลือกเซิร์ฟเวอร์ 4K ได้เลย!`,
    },
    {
      id: 'goal',
      label: '⚽ ประตูแรกมาแล้ว! อัปเดตสกอร์',
      title: `⚽ GOAL!! มีประตูเกิดขึ้นในคู่ ${stream.title}`,
      message: `🔥 สกอร์สดขณะนี้ ${stream.homeTeam.name} ${stream.homeTeam.score ?? 0} - ${stream.awayTeam.score ?? 0} ${stream.awayTeam.name} (${stream.currentMinute || "สด"}) อย่าพลาดชมช็อตสำคัญ!`,
    },
    {
      id: 'bigmatch',
      label: '🔥 ซูเปอร์บิ๊กแมตช์ ประจำสัปดาห์',
      title: `🔥 ซูเปอร์บิ๊กแมตช์ห้ามพลาด: ${stream.title}`,
      message: `⭐ บิ๊กแมตช์หยุดโลก ${stream.league} สดจาก${stream.stadium || 'สนาม'} พากย์ไทยโดยทีมงานมืออาชีพ รับชมพร้อมกันกว่า 100,000 คน`,
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setMessage(p.message);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      const newNotification: LiveNotification = {
        id: `notif-${Date.now()}`,
        streamId: stream.id,
        title: title.trim(),
        message: message.trim(),
        targetAudience,
        channels: {
          pushNotification,
          inAppBanner,
          soundAlert,
        },
        sentAt: new Date().toISOString(),
        recipientCount: currentAudience.count,
        status: 'sent',
      };

      onSendNotification(newNotification);
      setIsSending(false);
      setSendSuccess(true);

      setTimeout(() => {
        onClose();
        setSendSuccess(false);
      }, 1500);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#1E1E1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#161616] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>ส่งการแจ้งเตือนผู้ชม (Notify Users)</span>
                <span className="text-[10px] bg-red-600/90 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Push
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                บรอดแคสต์ส่งข้อความแจ้งเตือนด่วนเข้ามือถือและแอปพลิเคชันสำหรับผู้ชมสด
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-6 space-y-5 text-xs sm:text-sm">
          {/* Target Match Quick Info */}
          <div className="p-3 bg-[#141414] rounded-xl border border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-white/10 p-1 flex items-center justify-center shrink-0 border border-white/10">
                <img
                  src={stream.homeTeam.logo}
                  alt={stream.homeTeam.name}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-sm truncate">{stream.title}</div>
                <div className="text-xs text-amber-400 flex items-center gap-1.5">
                  <span>{stream.league}</span>
                  <span>•</span>
                  <span>{stream.matchTime}</span>
                </div>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30 whitespace-nowrap">
              🔴 สตรีมสด ({stream.resolution || '4K'})
            </span>
          </div>

          {/* Preset Template Chips */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>เลือกเทมเพลตข้อความด่วน:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-left border border-white/5 hover:border-amber-500/40 transition cursor-pointer group"
                >
                  <div className="font-bold text-xs text-amber-300 group-hover:text-amber-200">{p.label}</div>
                  <div className="text-[11px] text-gray-400 truncate mt-0.5">{p.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notification Title & Body Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 font-medium mb-1.5">
                หัวข้อการแจ้งเตือน (Notification Title) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น 🔴 เริ่มถ่ายทอดสดแล้ว! ลิเวอร์พูล พบ แมนฯ ซิตี้"
                className="w-full bg-[#141414] border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1.5">
                ข้อความแจ้งเตือน (Message Body) *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="กรอกข้อความแจ้งเตือนถึงผู้ชม..."
                className="w-full bg-[#141414] border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914] text-sm resize-none"
                required
              />
            </div>
          </div>

          {/* Target Audience Selector */}
          <div className="space-y-2">
            <label className="block text-gray-300 font-medium">กลุ่มเป้าหมายผู้รับ (Target Audience)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetAudience('all')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  targetAudience === 'all'
                    ? 'bg-[#E50914]/20 border-[#E50914] text-white'
                    : 'bg-[#141414] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-white">ผู้ใช้งานทุกคน</div>
                <div className="text-[11px] text-gray-400 mt-1">~142,500 บัญชี</div>
              </button>

              <button
                type="button"
                onClick={() => setTargetAudience('vip')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  targetAudience === 'vip'
                    ? 'bg-amber-500/20 border-amber-500 text-white'
                    : 'bg-[#141414] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-amber-400">สมาชิก VIP & Premium</div>
                <div className="text-[11px] text-gray-400 mt-1">~48,200 บัญชี</div>
              </button>

              <button
                type="button"
                onClick={() => setTargetAudience('followers')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  targetAudience === 'followers'
                    ? 'bg-sky-500/20 border-sky-500 text-white'
                    : 'bg-[#141414] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-sky-400">แฟนคลับคู่นี้</div>
                <div className="text-[11px] text-gray-400 mt-1">~36,800 บัญชี</div>
              </button>
            </div>
          </div>

          {/* Delivery Channels */}
          <div className="p-3 bg-[#141414] rounded-xl border border-white/5 space-y-2">
            <div className="text-xs font-bold text-gray-300">ช่องทางการส่ง (Delivery Channels):</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushNotification}
                  onChange={(e) => setPushNotification(e.target.checked)}
                  className="rounded bg-[#242424] border-white/20 text-[#E50914] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                <span>Web & App Push</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inAppBanner}
                  onChange={(e) => setInAppBanner(e.target.checked)}
                  className="rounded bg-[#242424] border-white/20 text-[#E50914] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>In-App Banner</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundAlert}
                  onChange={(e) => setSoundAlert(e.target.checked)}
                  className="rounded bg-[#242424] border-white/20 text-[#E50914] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>เสียงแจ้งเตือน</span>
              </label>
            </div>
          </div>

          {/* Realistic Notification Preview Mockup */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>ตัวอย่างการแสดงผลบนอุปกรณ์ผู้ชม (Live Preview):</span>
            </div>
            <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 shadow-inner flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#E50914] text-white font-black flex items-center justify-center text-sm shrink-0 shadow-md">
                M
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="font-bold text-white">MOVIEFLIX LIVE</span>
                  <span>ตอนนี้</span>
                </div>
                <div className="font-bold text-xs text-white mt-0.5 line-clamp-1">{title}</div>
                <div className="text-[11px] text-gray-300 line-clamp-2 mt-0.5">{message}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#E50914] bg-[#E50914]/10 px-2 py-0.5 rounded">
                  <span>กดเพื่อรับชมถ่ายทอดสด</span> →
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>
                พร้อมส่งถึง <strong className="text-white">{currentAudience.count.toLocaleString()}</strong> ผู้ชม
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSending}
                className="flex-1 sm:flex-initial px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={isSending || sendSuccess}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                  sendSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#E50914] hover:bg-[#E50914]/90 text-white shadow-[#E50914]/25'
                }`}
              >
                {sendSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ส่งการแจ้งเตือนสำเร็จแล้ว!</span>
                  </>
                ) : isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>กำลังกระจายสัญญาณแจ้งเตือน...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ส่งการแจ้งเตือนทันที (Broadcast)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
