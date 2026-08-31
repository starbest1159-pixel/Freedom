import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Server,
  Users,
  Send,
  Sparkles,
  Flame,
  Clock,
  MapPin,
  Trophy,
  Shield,
  Activity,
  Share2,
  Smile,
  Check,
  RefreshCw,
} from 'lucide-react';
import { LiveStream, StreamServer } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LiveStreamPlayerModalProps {
  stream: LiveStream | null;
  allStreams?: LiveStream[];
  otherStreams?: LiveStream[];
  isOpen: boolean;
  onClose: () => void;
  onSelectStream?: (stream: LiveStream) => void;
  onSelectOtherStream?: (stream: LiveStream) => void;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  badge?: string;
  badgeColor?: string;
  text: string;
  time: string;
  isUser?: boolean;
}

const PRESET_MESSAGES = [
  { sender: 'BallThaiFan99', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', text: 'ภาพคมชัดระดับ 4K มาก ลื่นไหลสุดๆ! 🔥', badge: 'VIP Fan', badgeColor: 'bg-amber-500' },
  { sender: 'RedDevil_7', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', text: 'คู่บิ๊กแมตช์วันนี้เดือดแน่นอน เสียงพากย์ไทยแจ่มมาก ⚽', badge: 'Fan Club', badgeColor: 'bg-red-500' },
  { sender: 'Kopite_Bangkok', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', text: 'YNWA! ลิเวอร์พูลสู้ๆ บุกหนักมากครึ่งหลัง 🔴🔴', badge: 'Subscriber', badgeColor: 'bg-emerald-500' },
  { sender: 'Citizen_TH', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', text: 'เซิร์ฟเวอร์ 1 ลื่นมาก ไม่มีกระตุกเลย แอดมินยอดเยี่ยมมาก 👍', badge: 'Fan Club', badgeColor: 'bg-sky-500' },
  { sender: 'CoachSomchai', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', text: 'จังหวะยิงลูกที่ 2 สุดยอดมาก เซฟแทบไม่ทัน!', badge: 'Guru', badgeColor: 'bg-purple-500' },
];

export const LiveStreamPlayerModal: React.FC<LiveStreamPlayerModalProps> = ({
  stream,
  allStreams = [],
  otherStreams,
  isOpen,
  onClose,
  onSelectStream,
  onSelectOtherStream,
}) => {
  const { t, language } = useLanguage();

  const streamList = (allStreams && allStreams.length > 0 ? allStreams : otherStreams) || [];
  const handleSelectStream = onSelectStream || onSelectOtherStream || (() => {});

  const [selectedServer, setSelectedServer] = useState<StreamServer>(
    stream?.streamServers?.[0] || {
      id: 'srv-default',
      name: 'Server 1 - หลัก HD',
      quality: '1080p 60FPS',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    }
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'stats' | 'lineups' | 'matches'>('chat');
  const [copied, setCopied] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Simulated live viewers fluctuation
  const [liveViewers, setLiveViewers] = useState(stream?.currentViewers || 185000);

  // Update selected server when stream changes
  useEffect(() => {
    if (stream?.streamServers && stream.streamServers.length > 0) {
      setSelectedServer(stream.streamServers[0]);
    }
    setLiveViewers(stream?.currentViewers || 185000);

    // Initial chat messages
    const initial = PRESET_MESSAGES.map((msg, idx) => ({
      ...msg,
      id: `chat-${Date.now()}-${idx}`,
      time: new Date(Date.now() - (5 - idx) * 30000).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    }));
    setChatMessages(initial);
  }, [stream]);

  // Viewer fluctuation interval
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => Math.max(1000, prev + Math.floor((Math.random() - 0.48) * 120)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Periodic simulated chat arrival
  useEffect(() => {
    const chatPool = [
      'เกมตึงมากตอนนี้ 555+',
      'กองหลังตัดบอลสวยมาก!',
      'พรีเมียร์ลีกปีนี้ลุ้นแชมป์มันส์สุดๆ ⚽🔥',
      'ขอบคุณสำหรับสตรีมสดคมชัดแบบนี้นะครับ แอดมิน',
      'กรรมการเป่าฟาวล์ถูกแล้ว ชัดเจน',
      'ลุ้นอีก 10 นาทีสุดท้าย จะมีประตูเพิ่มไหม?!',
      'เสียงพากย์น้าหังมันส์สะใจจริงๆ ครับ 🎙️',
      'บุกแหลกเลยตอนนี้!',
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.35) {
        const randomText = chatPool[Math.floor(Math.random() * chatPool.length)];
        const randomUser = PRESET_MESSAGES[Math.floor(Math.random() * PRESET_MESSAGES.length)];
        const newMsg: ChatMessage = {
          id: `live-chat-${Date.now()}`,
          sender: randomUser.sender,
          avatar: randomUser.avatar,
          badge: randomUser.badge,
          badgeColor: randomUser.badgeColor,
          text: randomText,
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev.slice(-30), newMsg]);
      }
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'ฉัน (Admin User)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      badge: 'แอดมิน',
      badgeColor: 'bg-[#E50914]',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !stream) return null;

  // Other live matches for quick switching
  const otherMatches = (streamList || []).filter((s) => s && s.id !== stream.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#1A1A1A] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 bg-[#E50914]/20 border border-[#E50914]/40 px-3 py-1 rounded-full text-xs font-bold text-[#E50914] animate-pulse shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#E50914]"></span>
              ถ่ายทอดสด LIVE
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-base sm:text-lg text-white truncate flex items-center gap-2">
                <span>{stream.title}</span>
                {stream.competitionRound && (
                  <span className="hidden sm:inline-block text-xs font-normal text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                    {stream.competitionRound}
                  </span>
                )}
              </h2>
              <div className="text-xs text-gray-400 flex items-center gap-3">
                <span className="text-amber-400 font-medium">{stream.league}</span>
                {stream.stadium && (
                  <span className="hidden md:flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {stream.stadium}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5 border border-white/5 transition"
              title="คัดลอกลิงก์แชร์สตรีม"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'คัดลอกแล้ว' : 'แชร์สตรีม'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
              title="ปิดหน้าต่างสตรีม"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content: Player (Left/Top) + Interactive Chat/Stats Sidebar (Right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Left: Video Player & Match Scoreboard Bar */}
          <div className="flex-1 flex flex-col bg-black overflow-y-auto">
            {/* Live Scoreboard Ribbon */}
            <div className="bg-gradient-to-r from-[#1A1A1A] via-[#242424] to-[#1A1A1A] border-b border-white/5 px-4 py-3 flex items-center justify-between shrink-0">
              {/* Home Team */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center p-1 border"
                  style={{ borderColor: stream.homeTeam.color || '#E50914' }}
                >
                  <img
                    src={stream.homeTeam.logo}
                    alt={stream.homeTeam.name}
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base text-white truncate">{stream.homeTeam.name}</div>
                  <div className="text-[11px] text-gray-400">เจ้าบ้าน (Home)</div>
                </div>
              </div>

              {/* Match Score & Live Timer */}
              <div className="flex flex-col items-center justify-center px-4 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-wider font-mono">
                    {stream.homeTeam.score ?? 0}
                  </span>
                  <span className="text-gray-500 font-bold text-lg">-</span>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-wider font-mono">
                    {stream.awayTeam.score ?? 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-red-400 font-semibold mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>{stream.currentMinute || "78' (สด)"}</span>
                </div>
              </div>

              {/* Away Team */}
              <div className="flex items-center gap-2.5 flex-1 justify-end min-w-0 text-right">
                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base text-white truncate">{stream.awayTeam.name}</div>
                  <div className="text-[11px] text-gray-400">ทีมเยือน (Away)</div>
                </div>
                <div
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center p-1 border"
                  style={{ borderColor: stream.awayTeam.color || '#0071EB' }}
                >
                  <img
                    src={stream.awayTeam.logo}
                    alt={stream.awayTeam.name}
                    className="w-full h-full object-contain rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Video Container */}
            <div ref={playerContainerRef} className="relative aspect-video w-full bg-black flex items-center justify-center group select-none">
              <video
                ref={videoRef}
                src={selectedServer.url}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Top Live Badges Overlay on Player */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-20 pointer-events-none">
                <span className="bg-red-600/90 text-white text-xs font-black px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  🔴 LIVE
                </span>
                <span className="bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10 flex items-center gap-1.5 shadow-lg">
                  <Users className="w-3.5 h-3.5 text-red-400" />
                  {liveViewers.toLocaleString()} กำลังรับชม
                </span>
                <span className="bg-[#E50914]/80 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm hidden sm:inline-block">
                  {selectedServer.quality}
                </span>
              </div>

              {/* Watermark Channel Logo */}
              <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-80 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                <Radio className="w-3.5 h-3.5 text-[#E50914]" />
                <span className="text-[11px] font-bold tracking-wider text-white">
                  {stream.channelName || 'MOVIEFLIX LIVE HD'}
                </span>
              </div>

              {/* Center Play Button Overlay (when paused) */}
              {!isPlaying && (
                <button
                  onClick={handleTogglePlay}
                  className="absolute z-20 p-5 rounded-full bg-[#E50914]/90 text-white hover:scale-110 transition shadow-2xl cursor-pointer"
                >
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </button>
              )}

              {/* Bottom Custom Control Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Live Progress Bar indicator */}
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#E50914] h-full w-full animate-pulse"></div>
                </div>

                <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTogglePlay}
                      className="p-1.5 hover:text-[#E50914] transition cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <button onClick={handleToggleMute} className="p-1 hover:text-[#E50914] transition">
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 sm:w-24 accent-[#E50914] h-1 bg-white/30 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                      สตรีมสด REAL-TIME
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-xs hidden sm:inline-block">
                      {stream.commentary || 'พากย์ไทย HD'}
                    </span>
                    <button
                      onClick={handleToggleFullscreen}
                      className="p-1.5 hover:text-[#E50914] transition cursor-pointer"
                      title="เต็มหน้าจอ"
                    >
                      {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Server Selector Bar */}
            <div className="p-3 sm:p-4 bg-[#181818] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-[#E50914]" />
                  เลือกเซิร์ฟเวอร์สตรีม:
                </span>
                {stream.streamServers.map((server, idx) => {
                  const isCurrent = selectedServer.id === server.id;
                  return (
                    <button
                      key={server.id}
                      onClick={() => setSelectedServer(server)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5'
                      }`}
                    >
                      <span>{server.name}</span>
                      <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${isCurrent ? 'bg-black/30 text-white' : 'bg-white/10 text-amber-300'}`}>
                        {server.quality}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-gray-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>เตะเวลา: <strong className="text-white">{stream.matchTime}</strong></span>
              </div>
            </div>

            {/* Match Information Bar */}
            <div className="p-4 bg-[#141414] space-y-2">
              <h3 className="font-bold text-lg text-white">{stream.title}</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                ถ่ายทอดสดศึกฟุตบอล {stream.league} {stream.competitionRound} ณ สนาม {stream.stadium} คมชัดระดับ {stream.resolution} สัญญาณสดเสียงพากย์ภาษาไทย มีระบบสลับเซิร์ฟเวอร์ความเร็วสูง
              </p>
            </div>
          </div>

          {/* Right: Interactive Sidebar (Live Chat / Match Stats / Lineups / Other Matches) */}
          <div className="w-full lg:w-96 bg-[#181818] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0 min-h-[380px] lg:min-h-0">
            {/* Tab Headers */}
            <div className="flex border-b border-white/10 bg-[#1F1F1F] p-1 gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'chat'
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>แชทสด</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'stats'
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>สถิติสด</span>
              </button>

              <button
                onClick={() => setActiveTab('lineups')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'lineups'
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>แผนการเล่น</span>
              </button>

              <button
                onClick={() => setActiveTab('matches')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'matches'
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>คู่อื่นๆ</span>
              </button>
            </div>

            {/* Tab 1: Live Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden min-h-[300px]">
                {/* Chat Stream Messages */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                  <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-center text-gray-400 text-[11px]">
                    ⚽ ยินดีต้อนรับสู่ห้องถ่ายทอดสด {stream.title} กรุณาแสดงความคิดเห็นด้วยความสุภาพ
                  </div>

                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-xl transition ${
                        msg.isUser
                          ? 'bg-[#E50914]/15 border border-[#E50914]/30 ml-4'
                          : 'bg-[#242424] border border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <img src={msg.avatar} alt={msg.sender} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-bold text-gray-200">{msg.sender}</span>
                          {msg.badge && (
                            <span className={`${msg.badgeColor || 'bg-gray-700'} text-white text-[9px] font-bold px-1.5 py-0.2 rounded`}>
                              {msg.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500">{msg.time}</span>
                      </div>
                      <p className="text-gray-300 leading-snug break-words pl-6.5">{msg.text}</p>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Emoji Bar */}
                <div className="px-3 py-1.5 bg-[#1F1F1F] border-t border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0">
                  {['⚽', '🔥', '🎉', '👏', '🔴', '🏆', '🎯', '💯'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setInputMessage((prev) => prev + emoji)}
                      className="text-sm p-1 hover:bg-white/10 rounded transition cursor-pointer shrink-0"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Chat Input Form */}
                <form onSubmit={handleSendMessage} className="p-3 bg-[#1A1A1A] border-t border-white/10 flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="ส่งข้อความคุยสดเชียร์บอล..."
                    className="flex-1 bg-[#282828] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#E50914] text-white rounded-xl hover:bg-[#E50914]/90 transition cursor-pointer shrink-0 shadow-md shadow-[#E50914]/30"
                    title="ส่งข้อความ"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Match Stats */}
            {activeTab === 'stats' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                <div className="text-center font-bold text-white mb-2">สถิติการแข่งขันแบบ Real-Time</div>

                {/* Possession */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-gray-300">
                    <span className="text-[#C8102E]">58%</span>
                    <span className="text-gray-400">การครองบอล</span>
                    <span className="text-[#6CABDD]">42%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div className="bg-[#C8102E] h-full" style={{ width: '58%' }}></div>
                    <div className="bg-[#6CABDD] h-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                {/* Total Shots */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-gray-300">
                    <span className="text-[#C8102E]">14</span>
                    <span className="text-gray-400">โอกาสยิงทั้งหมด</span>
                    <span className="text-[#6CABDD]">9</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div className="bg-[#C8102E] h-full" style={{ width: '61%' }}></div>
                    <div className="bg-[#6CABDD] h-full" style={{ width: '39%' }}></div>
                  </div>
                </div>

                {/* Shots on Target */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-gray-300">
                    <span className="text-[#C8102E]">7</span>
                    <span className="text-gray-400">ยิงตรงกรอบ</span>
                    <span className="text-[#6CABDD]">4</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div className="bg-[#C8102E] h-full" style={{ width: '64%' }}></div>
                    <div className="bg-[#6CABDD] h-full" style={{ width: '36%' }}></div>
                  </div>
                </div>

                {/* Corner Kicks */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-gray-300">
                    <span className="text-[#C8102E]">6</span>
                    <span className="text-gray-400">เตะมุม</span>
                    <span className="text-[#6CABDD]">3</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div className="bg-[#C8102E] h-full" style={{ width: '67%' }}></div>
                    <div className="bg-[#6CABDD] h-full" style={{ width: '33%' }}></div>
                  </div>
                </div>

                {/* Fouls */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold text-gray-300">
                    <span className="text-[#C8102E]">9</span>
                    <span className="text-gray-400">ฟาวล์</span>
                    <span className="text-[#6CABDD]">11</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div className="bg-[#C8102E] h-full" style={{ width: '45%' }}></div>
                    <div className="bg-[#6CABDD] h-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Lineups */}
            {activeTab === 'lineups' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                <div className="bg-[#242424] p-3 rounded-xl border border-white/5">
                  <div className="font-bold text-white mb-2 flex items-center justify-between">
                    <span>{stream.homeTeam.name} (4-3-3)</span>
                    <span className="text-[10px] text-gray-400">เจ้าบ้าน</span>
                  </div>
                  <ul className="space-y-1 text-gray-300 text-[11px]">
                    <li>• GK: อลิสซง เบ็คเกอร์</li>
                    <li>• DF: เทรนต์, ฟาน ไดจ์ค, โกนาเต้, โรเบิร์ตสัน</li>
                    <li>• MF: แม็ค อัลลิสเตอร์, โซโบสไล, กราเฟนแบร์ก</li>
                    <li>• FW: โมฮาเหม็ด ซาลาห์, หลุยส์ ดิอาซ, ดาร์วิน นูเญซ</li>
                  </ul>
                </div>

                <div className="bg-[#242424] p-3 rounded-xl border border-white/5">
                  <div className="font-bold text-white mb-2 flex items-center justify-between">
                    <span>{stream.awayTeam.name} (4-1-4-1)</span>
                    <span className="text-[10px] text-gray-400">ทีมเยือน</span>
                  </div>
                  <ul className="space-y-1 text-gray-300 text-[11px]">
                    <li>• GK: เอแดร์ซอน โมราเอส</li>
                    <li>• DF: วอล์คเกอร์, รูเบน ดิอาส, อาคันจี, กวาร์ดิโอล</li>
                    <li>• MF: โรดรี้, เดอ บรอยน์, แบร์นาร์โด้ ซิลวา, โฟเด้น</li>
                    <li>• FW: เออร์ลิง ฮาแลนด์</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 4: Other Live Matches */}
            {activeTab === 'matches' && (
              <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                <div className="text-gray-400 text-[11px] mb-1 font-medium">สลับไปรับชมคู่ถ่ายทอดสดอื่นๆ:</div>
                {otherMatches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectStream(m)}
                    className="w-full text-left p-3 rounded-xl bg-[#242424] hover:bg-white/10 transition border border-white/5 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-amber-400 font-semibold truncate">{m.league}</span>
                      {m.status === 'live' ? (
                        <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded animate-pulse">
                          🔴 LIVE {m.currentMinute}
                        </span>
                      ) : (
                        <span className="bg-white/10 text-gray-400 text-[9px] px-1.5 py-0.2 rounded">
                          {m.matchTime}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-white text-xs truncate group-hover:text-[#E50914] transition">
                      {m.title}
                    </div>
                    {m.status === 'live' && (
                      <div className="text-[11px] text-gray-400 mt-1 font-mono">
                        สกอร์: <strong className="text-white">{m.homeTeam.name} {m.homeTeam.score} - {m.awayTeam.score} {m.awayTeam.name}</strong>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
