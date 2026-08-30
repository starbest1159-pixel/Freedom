import React, { useState } from 'react';
import {
  Radio,
  Plus,
  Search,
  Tv,
  Users,
  Play,
  Edit2,
  Trash2,
  ExternalLink,
  Flame,
  Clock,
  MapPin,
  Trophy,
  Filter,
  CheckCircle2,
  AlertCircle,
  Server,
  Volume2,
  Share2,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  Bell,
  Send,
} from 'lucide-react';
import { LiveStream, StreamServer, LiveMatchStatus, LiveNotification } from '../types';
import { LiveStreamNotifyModal } from './LiveStreamNotifyModal';
import { useLanguage } from '../context/LanguageContext';

interface LiveStreamManagementProps {
  streams: LiveStream[];
  onAddStream: (stream: LiveStream) => void;
  onUpdateStream: (stream: LiveStream) => void;
  onDeleteStream: (id: string) => void;
  onOpenPlayer: (stream: LiveStream) => void;
  onSendNotification?: (notification: LiveNotification) => void;
}

const POPULAR_TEAMS = [
  { name: 'ลิเวอร์พูล', logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150', color: '#C8102E' },
  { name: 'แมนเชสเตอร์ ซิตี้', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150', color: '#6CABDD' },
  { name: 'อาร์เซนอล', logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=150', color: '#EF0107' },
  { name: 'เชลซี', logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=150', color: '#034694' },
  { name: 'แมนเชสเตอร์ ยูไนเต็ด', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150', color: '#DA291C' },
  { name: 'ท็อตแนม ฮ็อตสเปอร์', logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150', color: '#132257' },
  { name: 'เรอัล มาดริด', logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=150', color: '#FFFFFF' },
  { name: 'บาร์เซโลนา', logo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=150', color: '#004D98' },
  { name: 'บาเยิร์น มิวนิค', logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150', color: '#DC052D' },
  { name: 'บุรีรัมย์ ยูไนเต็ด', logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150', color: '#002B66' },
  { name: 'เมืองทอง ยูไนเต็ด', logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=150', color: '#CC0000' },
];

export const LiveStreamManagement: React.FC<LiveStreamManagementProps> = ({
  streams,
  onAddStream,
  onUpdateStream,
  onDeleteStream,
  onOpenPlayer,
  onSendNotification,
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<LiveStream | null>(null);

  // Modal State for Notify Users
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyingStream, setNotifyingStream] = useState<LiveStream | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formLeague, setFormLeague] = useState('พรีเมียร์ลีก อังกฤษ (Premier League)');
  const [formCategory, setFormCategory] = useState<'football' | 'boxing' | 'motorsport' | 'basketball' | 'tv-channel' | 'special'>('football');
  const [formStatus, setFormStatus] = useState<LiveMatchStatus>('live');
  const [formHomeName, setFormHomeName] = useState('ลิเวอร์พูล');
  const [formHomeLogo, setFormHomeLogo] = useState('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150');
  const [formHomeScore, setFormHomeScore] = useState<number>(0);
  const [formHomeColor, setFormHomeColor] = useState('#C8102E');

  const [formAwayName, setFormAwayName] = useState('แมนเชสเตอร์ ซิตี้');
  const [formAwayLogo, setFormAwayLogo] = useState('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150');
  const [formAwayScore, setFormAwayScore] = useState<number>(0);
  const [formAwayColor, setFormAwayColor] = useState('#6CABDD');

  const [formMatchTime, setFormMatchTime] = useState('22:30 น. วันนี้');
  const [formMatchDate, setFormMatchDate] = useState('29 ส.ค. 2026');
  const [formStadium, setFormStadium] = useState('แอนฟิลด์ (Anfield)');
  const [formRound, setFormRound] = useState('แมตช์เดย์ 28');
  const [formMinute, setFormMinute] = useState("75' (สด)");
  const [formResolution, setFormResolution] = useState('4K UHD 60FPS');
  const [formCommentary, setFormCommentary] = useState('พากย์ไทย (ทีมงาน True Premier)');
  const [formChannel, setFormChannel] = useState('True Premier Football HD 1');
  const [formPinned, setFormPinned] = useState(true);

  // Server URLs
  const [formServers, setFormServers] = useState<StreamServer[]>([
    {
      id: 'srv-1',
      name: 'Server 1 - หลัก 4K HDR',
      quality: '4K 60FPS',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
    {
      id: 'srv-2',
      name: 'Server 2 - FHD สำรอง',
      quality: '1080p 60FPS',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      isBackup: true,
    },
  ]);

  const handleOpenAddModal = () => {
    setEditingStream(null);
    setFormTitle('ลิเวอร์พูล พบ แมนเชสเตอร์ ซิตี้');
    setFormLeague('พรีเมียร์ลีก อังกฤษ (Premier League)');
    setFormCategory('football');
    setFormStatus('live');
    setFormHomeName('ลิเวอร์พูล');
    setFormHomeLogo('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150');
    setFormHomeScore(2);
    setFormHomeColor('#C8102E');
    setFormAwayName('แมนเชสเตอร์ ซิตี้');
    setFormAwayLogo('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150');
    setFormAwayScore(1);
    setFormAwayColor('#6CABDD');
    setFormMatchTime('22:30 น. วันนี้');
    setFormMatchDate('29 ส.ค. 2026');
    setFormStadium('แอนฟิลด์ (Anfield)');
    setFormRound('แมตช์เดย์ 28 (ซูเปอร์บิ๊กแมตช์)');
    setFormMinute("78' (สด)");
    setFormResolution('4K UHD 60FPS');
    setFormCommentary('พากย์ไทย (ทีมงาน True Premier)');
    setFormChannel('True Premier Football HD 1');
    setFormPinned(true);
    setFormServers([
      {
        id: 'srv-1',
        name: 'Server 1 - หลัก 4K UHD',
        quality: '4K 60FPS',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      },
      {
        id: 'srv-2',
        name: 'Server 2 - FHD สำรอง',
        quality: '1080p 60FPS',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        isBackup: true,
      },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (stream: LiveStream) => {
    setEditingStream(stream);
    setFormTitle(stream.title);
    setFormLeague(stream.league);
    setFormCategory(stream.category);
    setFormStatus(stream.status);
    setFormHomeName(stream.homeTeam.name);
    setFormHomeLogo(stream.homeTeam.logo);
    setFormHomeScore(stream.homeTeam.score || 0);
    setFormHomeColor(stream.homeTeam.color || '#E50914');
    setFormAwayName(stream.awayTeam.name);
    setFormAwayLogo(stream.awayTeam.logo);
    setFormAwayScore(stream.awayTeam.score || 0);
    setFormAwayColor(stream.awayTeam.color || '#0071EB');
    setFormMatchTime(stream.matchTime);
    setFormMatchDate(stream.matchDate);
    setFormStadium(stream.stadium || '');
    setFormRound(stream.competitionRound || '');
    setFormMinute(stream.currentMinute || '');
    setFormResolution(stream.resolution || '4K UHD 60FPS');
    setFormCommentary(stream.commentary || 'พากย์ไทย');
    setFormChannel(stream.channelName || 'True Premier Football HD 1');
    setFormPinned(stream.pinned ?? true);
    setFormServers(stream.streamServers || []);
    setIsModalOpen(true);
  };

  const handleSaveStream = (e: React.FormEvent) => {
    e.preventDefault();

    const streamData: LiveStream = {
      id: editingStream ? editingStream.id : `live-${Date.now()}`,
      code: editingStream ? editingStream.code : `#LIVE-${Math.floor(100 + Math.random() * 900)}`,
      title: formTitle || `${formHomeName} พบ ${formAwayName}`,
      league: formLeague,
      category: formCategory,
      status: formStatus,
      homeTeam: {
        name: formHomeName,
        logo: formHomeLogo,
        score: formHomeScore,
        color: formHomeColor,
      },
      awayTeam: {
        name: formAwayName,
        logo: formAwayLogo,
        score: formAwayScore,
        color: formAwayColor,
      },
      matchTime: formMatchTime,
      matchDate: formMatchDate,
      stadium: formStadium,
      competitionRound: formRound,
      currentMinute: formMinute,
      streamServers: formServers.length > 0 ? formServers : [
        {
          id: 'srv-1',
          name: 'Server 1 - หลัก HD',
          quality: '1080p 60FPS',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }
      ],
      currentViewers: editingStream ? editingStream.currentViewers : Math.floor(50000 + Math.random() * 200000),
      thumbnail: editingStream ? editingStream.thumbnail : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600',
      backdrop: editingStream ? editingStream.backdrop : 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600',
      resolution: formResolution,
      commentary: formCommentary,
      channelName: formChannel,
      pinned: formPinned,
      featured: true,
      chatEnabled: true,
      createdAt: editingStream ? editingStream.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingStream) {
      onUpdateStream(streamData);
    } else {
      onAddStream(streamData);
    }

    setIsModalOpen(false);
  };

  // Quick Score Update Handlers
  const handleQuickScoreChange = (stream: LiveStream, team: 'home' | 'away', delta: number) => {
    const updated: LiveStream = {
      ...stream,
      homeTeam: {
        ...stream.homeTeam,
        score: team === 'home' ? Math.max(0, (stream.homeTeam.score || 0) + delta) : stream.homeTeam.score,
      },
      awayTeam: {
        ...stream.awayTeam,
        score: team === 'away' ? Math.max(0, (stream.awayTeam.score || 0) + delta) : stream.awayTeam.score,
      },
      updatedAt: new Date().toISOString(),
    };
    onUpdateStream(updated);
  };

  const handleToggleStatus = (stream: LiveStream) => {
    const nextStatus: LiveMatchStatus = stream.status === 'live' ? 'ended' : stream.status === 'upcoming' ? 'live' : 'upcoming';
    const updated: LiveStream = {
      ...stream,
      status: nextStatus,
      currentMinute: nextStatus === 'live' ? "1' (เริ่มเกม)" : nextStatus === 'ended' ? 'จบการแข่งขัน' : 'เร็วๆ นี้',
      updatedAt: new Date().toISOString(),
    };
    onUpdateStream(updated);
  };

  const handleOpenNotifyModal = (stream: LiveStream) => {
    setNotifyingStream(stream);
    setIsNotifyModalOpen(true);
  };

  const handleSendNotificationInternal = (notification: LiveNotification) => {
    if (onSendNotification) {
      onSendNotification(notification);
    }
  };

  // Filtering
  const filteredStreams = streams.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.league.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'live' && s.status === 'live') ||
      (selectedCategory === 'upcoming' && s.status === 'upcoming') ||
      (selectedCategory === 'ended' && s.status === 'ended') ||
      s.category === selectedCategory;

    const matchLeague =
      selectedLeague === 'all' || s.league.includes(selectedLeague);

    return matchSearch && matchCategory && matchLeague;
  });

  const totalLiveMatches = streams.filter((s) => s.status === 'live').length;
  const totalLiveViewers = streams
    .filter((s) => s.status === 'live')
    .reduce((acc, curr) => acc + (curr.currentViewers || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-[#242424] to-[#1A1A1A] rounded-xl border border-white/5 flex items-center gap-3">
          <div className="p-3 bg-red-500/20 text-red-500 rounded-xl">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">{t.liveStream.liveNowMatches}</div>
            <div className="text-2xl font-black text-white">{totalLiveMatches} {t.common.items}</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#242424] to-[#1A1A1A] rounded-xl border border-white/5 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">{t.liveStream.liveViewersRealtime}</div>
            <div className="text-2xl font-black text-white">{totalLiveViewers.toLocaleString()} {language === 'th' ? 'คน' : 'viewers'}</div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#242424] to-[#1A1A1A] rounded-xl border border-white/5 flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">{language === 'th' ? 'พรีเมียร์ลีก อังกฤษ' : 'Premier League'}</div>
            <div className="text-2xl font-black text-white">
              {streams.filter((s) => s.league.includes('พรีเมียร์ลีก') || s.league.toLowerCase().includes('premier')).length} {t.common.items}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#242424] to-[#1A1A1A] rounded-xl border border-white/5 flex items-center gap-3">
          <div className="p-3 bg-sky-500/20 text-sky-500 rounded-xl">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-medium">{t.liveStream.streamingServers}</div>
            <div className="text-2xl font-black text-white">{t.liveStream.serversOnline}</div>
          </div>
        </div>
      </div>

      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Radio className="w-7 h-7 text-[#E50914] animate-pulse" />
            <span>{t.liveStream.title}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            {t.liveStream.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              const activeStream = streams.find((s) => s.status === 'live') || streams[0];
              if (activeStream) handleOpenNotifyModal(activeStream);
            }}
            className="px-3.5 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/10"
            title="Notify viewers"
          >
            <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{t.liveStream.notifyUsers}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-[#28A745] hover:bg-[#28A745]/90 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition shadow-lg shadow-[#28A745]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.liveStream.addLiveStream}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-[#242424] rounded-xl border border-white/5 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.liveStream.searchPlaceholder}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* League Dropdown Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50914]"
            >
              <option value="all">{t.liveStream.allLeagues}</option>
              <option value="พรีเมียร์ลีก">{language === 'th' ? 'พรีเมียร์ลีก อังกฤษ (EPL)' : 'Premier League (EPL)'}</option>
              <option value="แชมเปียนส์ลีก">{language === 'th' ? 'ยูฟ่า แชมเปียนส์ลีก (UCL)' : 'UEFA Champions League (UCL)'}</option>
              <option value="ไทยลีก">{language === 'th' ? 'รีโว่ ไทยลีก (Thai League)' : 'Thai League'}</option>
              <option value="ช่องกีฬา">{language === 'th' ? 'ช่องสด 24 ชม.' : '24H Live Channels'}</option>
            </select>

            <div className="flex items-center bg-[#1A1A1A] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  viewMode === 'grid' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.liveStream.viewModeGrid}
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  viewMode === 'table' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.liveStream.viewModeTable}
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pt-1">
          {[
            { id: 'all', label: t.common.all },
            { id: 'live', label: 'LIVE' },
            { id: 'upcoming', label: language === 'th' ? 'เร็วๆ นี้' : 'Upcoming' },
            { id: 'ended', label: language === 'th' ? 'จบการแข่งขัน' : 'Ended' },
            { id: 'football', label: language === 'th' ? 'ฟุตบอล' : 'Football' },
            { id: 'tv-channel', label: language === 'th' ? 'ช่องสด 24H' : '24H TV' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStreams.map((stream) => {
            const isLive = stream.status === 'live';
            const isUpcoming = stream.status === 'upcoming';

            return (
              <div
                key={stream.id}
                className="bg-[#242424] rounded-2xl border border-white/10 overflow-hidden shadow-xl hover:border-white/20 transition-all flex flex-col group"
              >
                {/* Header Tag Bar */}
                <div className="px-4 py-3 bg-[#1E1E1E] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded truncate">
                      {stream.league}
                    </span>
                    <span className="text-[10px] text-gray-400">{stream.code}</span>
                  </div>

                  {/* Status Toggle Badge */}
                  <button
                    onClick={() => handleToggleStatus(stream)}
                    className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                      isLive
                        ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/30'
                        : isUpcoming
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-gray-700/60 text-gray-400'
                    }`}
                    title="คลิกเพื่อสลับสถานะ (LIVE / เร็วๆ นี้ / จบแล้ว)"
                  >
                    {isLive && <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>}
                    <span>{isLive ? 'LIVE' : isUpcoming ? (language === 'th' ? 'เร็วๆ นี้' : 'Upcoming') : (language === 'th' ? 'จบแล้ว' : 'Full Time')}</span>
                  </button>
                </div>

                {/* Match Visual Showcase & Teams Score */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {/* Round & Stadium info */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-medium text-gray-300">{stream.competitionRound || 'แมตช์เดย์'}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {stream.matchTime}
                    </span>
                  </div>

                  {/* Teams & Score Box */}
                  <div className="bg-[#1A1A1A] p-4 rounded-xl border border-white/5 flex items-center justify-between gap-2">
                    {/* Home Team */}
                    <div className="flex flex-col items-center text-center flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-full bg-white/10 p-1 flex items-center justify-center border-2 mb-1.5"
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
                      <div className="font-bold text-sm text-white truncate w-full">{stream.homeTeam.name}</div>
                      <div className="text-[10px] text-gray-400">เจ้าบ้าน</div>

                      {/* Home Score Adjustment */}
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => handleQuickScoreChange(stream, 'home', -1)}
                          className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer"
                          title="ลด 1 ประตู"
                        >
                          -
                        </button>
                        <span className="text-lg font-black text-white w-6 text-center font-mono">
                          {stream.homeTeam.score ?? 0}
                        </span>
                        <button
                          onClick={() => handleQuickScoreChange(stream, 'home', 1)}
                          className="w-5 h-5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center justify-center cursor-pointer"
                          title="เพิ่ม 1 ประตู"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* VS & Minute Badge */}
                    <div className="flex flex-col items-center justify-center px-2">
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">VS</span>
                      <div className="px-2 py-0.5 bg-[#282828] border border-white/10 rounded-full text-[11px] font-bold text-amber-400">
                        {stream.currentMinute || (isLive ? "75'" : stream.matchTime)}
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center text-center flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-full bg-white/10 p-1 flex items-center justify-center border-2 mb-1.5"
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
                      <div className="font-bold text-sm text-white truncate w-full">{stream.awayTeam.name}</div>
                      <div className="text-[10px] text-gray-400">ทีมเยือน</div>

                      {/* Away Score Adjustment */}
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => handleQuickScoreChange(stream, 'away', -1)}
                          className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer"
                          title="ลด 1 ประตู"
                        >
                          -
                        </button>
                        <span className="text-lg font-black text-white w-6 text-center font-mono">
                          {stream.awayTeam.score ?? 0}
                        </span>
                        <button
                          onClick={() => handleQuickScoreChange(stream, 'away', 1)}
                          className="w-5 h-5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center justify-center cursor-pointer"
                          title="เพิ่ม 1 ประตู"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stream Specs & Server Count */}
                  <div className="flex items-center justify-between text-xs text-gray-400 bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-[#E50914]" />
                      <span>{stream.streamServers.length} เซิร์ฟเวอร์ ({stream.resolution})</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{(stream.currentViewers || 0).toLocaleString()} ผู้ชม</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-[#1F1F1F] border-t border-white/5 flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => onOpenPlayer(stream)}
                    className="flex-1 py-2 rounded-lg bg-[#E50914] hover:bg-[#E50914]/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-[#E50914]/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>เปิดสตรีมสด</span>
                  </button>

                  <button
                    onClick={() => handleOpenNotifyModal(stream)}
                    className="p-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 hover:text-amber-300 transition cursor-pointer border border-amber-500/30 flex items-center gap-1"
                    title="ส่งการแจ้งเตือน (Notify Users)"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="hidden xl:inline text-[11px] font-bold">แจ้งเตือน</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(stream)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer border border-white/5"
                    title="แก้ไขข้อมูลคู่แข่งขันและเซิร์ฟเวอร์"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteStream(stream.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer border border-red-500/20"
                    title="ลบสตรีมนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#242424] rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#1A1A1A] text-gray-400 font-bold border-b border-white/10 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">คู่แข่งขัน</th>
                  <th className="px-4 py-3">ลีก / รายการ</th>
                  <th className="px-4 py-3 text-center">สกอร์สด</th>
                  <th className="px-4 py-3 text-center">สถานะ</th>
                  <th className="px-4 py-3">เวลาแข่งขัน</th>
                  <th className="px-4 py-3">เซิร์ฟเวอร์</th>
                  <th className="px-4 py-3 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStreams.map((stream) => (
                  <tr key={stream.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white text-sm">{stream.title}</div>
                      <div className="text-[11px] text-gray-400">{stream.stadium || stream.channelName}</div>
                    </td>
                    <td className="px-4 py-3.5 text-amber-400 font-medium">{stream.league}</td>
                    <td className="px-4 py-3.5 text-center font-bold text-base text-white font-mono">
                      {stream.homeTeam.score ?? 0} - {stream.awayTeam.score ?? 0}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          stream.status === 'live'
                            ? 'bg-red-600 text-white animate-pulse'
                            : stream.status === 'upcoming'
                            ? 'bg-sky-500/20 text-sky-400'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {stream.status === 'live' ? 'LIVE' : stream.status === 'upcoming' ? (language === 'th' ? 'เร็วๆ นี้' : 'Upcoming') : (language === 'th' ? 'จบแล้ว' : 'Full Time')}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-300">{stream.matchTime}</td>
                    <td className="px-4 py-3.5 text-gray-400">
                      {stream.streamServers.length} ช่องทาง ({stream.resolution})
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenPlayer(stream)}
                          className="p-1.5 bg-[#E50914] text-white rounded hover:bg-[#E50914]/90 transition cursor-pointer"
                          title="เปิดดูสด"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => handleOpenNotifyModal(stream)}
                          className="p-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded transition cursor-pointer border border-amber-500/30"
                          title="ส่งการแจ้งเตือน (Notify Users)"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(stream)}
                          className="p-1.5 bg-white/10 text-white rounded hover:bg-white/20 transition cursor-pointer"
                          title="แก้ไข"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteStream(stream.id)}
                          className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition cursor-pointer"
                          title="ลบ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#1F1F1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#181818] border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#E50914]" />
                <span>{editingStream ? 'แก้ไขคู่ถ่ายทอดสด' : 'เพิ่มคู่ถ่ายทอดสด / สตรีมกีฬา'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveStream} className="p-6 space-y-5 text-xs sm:text-sm">
              {/* Preset Team Quick Selector */}
              <div className="p-3 bg-[#141414] rounded-xl border border-white/5 space-y-2">
                <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>เลือกทีมพรีเมียร์ลีกยอดนิยมแบบด่วน:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TEAMS.map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => {
                        if (!formHomeName || formHomeName === 'เจ้าบ้าน') {
                          setFormHomeName(t.name);
                          setFormHomeLogo(t.logo);
                          setFormHomeColor(t.color);
                        } else {
                          setFormAwayName(t.name);
                          setFormAwayLogo(t.logo);
                          setFormAwayColor(t.color);
                        }
                      }}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white text-xs rounded-lg border border-white/5 transition"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Match Title & League */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-medium mb-1.5">ชื่อการถ่ายทอดสด / คู่แข่งขัน *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="เช่น ลิเวอร์พูล พบ แมนฯ ซิตี้"
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-medium mb-1.5">ลีก / รายการแข่งขัน *</label>
                  <select
                    value={formLeague}
                    onChange={(e) => setFormLeague(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                  >
                    <option value="พรีเมียร์ลีก อังกฤษ (Premier League)">พรีเมียร์ลีก อังกฤษ (Premier League)</option>
                    <option value="ยูฟ่า แชมเปียนส์ลีก (UEFA Champions League)">ยูฟ่า แชมเปียนส์ลีก (UEFA Champions League)</option>
                    <option value="ลาลีกา สเปน (La Liga)">ลาลีกา สเปน (La Liga)</option>
                    <option value="บุนเดสลีกา เยอรมัน (Bundesliga)">บุนเดสลีกา เยอรมัน (Bundesliga)</option>
                    <option value="รีโว่ ไทยลีก (Thai League 1)">รีโว่ ไทยลีก (Thai League 1)</option>
                    <option value="ช่องกีฬาพรีเมียม 24 ชั่วโมง">ช่องกีฬาพรีเมียม 24 ชั่วโมง</option>
                  </select>
                </div>
              </div>

              {/* Home Team & Away Team Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#141414] rounded-xl border border-white/5">
                {/* Home Team */}
                <div className="space-y-3">
                  <div className="font-bold text-red-400">🔴 ทีมเจ้าบ้าน (Home)</div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">ชื่อทีมเหย้า</label>
                    <input
                      type="text"
                      value={formHomeName}
                      onChange={(e) => setFormHomeName(e.target.value)}
                      className="w-full bg-[#242424] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">สกอร์สด</label>
                      <input
                        type="number"
                        min="0"
                        value={formHomeScore}
                        onChange={(e) => setFormHomeScore(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#242424] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">สีประจำทีม</label>
                      <input
                        type="color"
                        value={formHomeColor}
                        onChange={(e) => setFormHomeColor(e.target.value)}
                        className="w-full h-8 bg-[#242424] border border-white/10 rounded-lg p-1 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">URL โลโก้ทีมเหย้า</label>
                    <input
                      type="text"
                      value={formHomeLogo}
                      onChange={(e) => setFormHomeLogo(e.target.value)}
                      className="w-full bg-[#242424] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Away Team */}
                <div className="space-y-3">
                  <div className="font-bold text-sky-400">🔵 ทีมเยือน (Away)</div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">ชื่อทีมเยือน</label>
                    <input
                      type="text"
                      value={formAwayName}
                      onChange={(e) => setFormAwayName(e.target.value)}
                      className="w-full bg-[#242424] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">สกอร์สด</label>
                      <input
                        type="number"
                        min="0"
                        value={formAwayScore}
                        onChange={(e) => setFormAwayScore(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#242424] border border-white/10 rounded-lg px-3 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">สีประจำทีม</label>
                      <input
                        type="color"
                        value={formAwayColor}
                        onChange={(e) => setFormAwayColor(e.target.value)}
                        className="w-full h-8 bg-[#242424] border border-white/10 rounded-lg p-1 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-1">URL โลโก้ทีมเยือน</label>
                    <input
                      type="text"
                      value={formAwayLogo}
                      onChange={(e) => setFormAwayLogo(e.target.value)}
                      className="w-full bg-[#242424] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Match Schedule & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-400 font-medium mb-1">สถานะสตรีม *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as LiveMatchStatus)}
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="live">🔴 กำลังถ่ายทอดสด (LIVE)</option>
                    <option value="upcoming">⏳ เร็วๆ นี้ (Upcoming)</option>
                    <option value="ended">✅ จบการแข่งขัน (Ended)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 font-medium mb-1">เวลาเตะ / สตรีม</label>
                  <input
                    type="text"
                    value={formMatchTime}
                    onChange={(e) => setFormMatchTime(e.target.value)}
                    placeholder="เช่น 22:30 น. วันนี้"
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-medium mb-1">นาทีการแข่งขัน</label>
                  <input
                    type="text"
                    value={formMinute}
                    onChange={(e) => setFormMinute(e.target.value)}
                    placeholder="เช่น 78' (สด)"
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Stadium & Round */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 font-medium mb-1">สนามแข่งขัน</label>
                  <input
                    type="text"
                    value={formStadium}
                    onChange={(e) => setFormStadium(e.target.value)}
                    placeholder="เช่น แอนฟิลด์ (Anfield)"
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-medium mb-1">รอบการแข่งขัน</label>
                  <input
                    type="text"
                    value={formRound}
                    onChange={(e) => setFormRound(e.target.value)}
                    placeholder="เช่น แมตช์เดย์ 28"
                    className="w-full bg-[#141414] border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Stream Servers Configuration */}
              <div className="p-4 bg-[#141414] rounded-xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-[#E50914]" />
                    <span>เซิร์ฟเวอร์สตรีมมิ่ง (Stream Servers)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = `srv-${Date.now()}`;
                      setFormServers([
                        ...formServers,
                        {
                          id: newId,
                          name: `Server ${formServers.length + 1} - สำรอง`,
                          quality: '1080p 60FPS',
                          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                          isBackup: true,
                        },
                      ]);
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    + เพิ่มเซิร์ฟเวอร์
                  </button>
                </div>

                {formServers.map((srv, idx) => (
                  <div key={srv.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-[#242424] p-2.5 rounded-lg border border-white/5">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={srv.name}
                        onChange={(e) => {
                          const updated = [...formServers];
                          updated[idx].name = e.target.value;
                          setFormServers(updated);
                        }}
                        placeholder="ชื่อ Server"
                        className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={srv.quality}
                        onChange={(e) => {
                          const updated = [...formServers];
                          updated[idx].quality = e.target.value;
                          setFormServers(updated);
                        }}
                        placeholder="4K / 1080p"
                        className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={srv.url}
                        onChange={(e) => {
                          const updated = [...formServers];
                          updated[idx].url = e.target.value;
                          setFormServers(updated);
                        }}
                        placeholder="URL สตรีม (m3u8, mp4, iframe)"
                        className="w-full bg-[#141414] border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-center justify-center">
                      {formServers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormServers(formServers.filter((_, i) => i !== idx));
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#E50914] hover:bg-[#E50914]/90 text-white font-bold rounded-xl transition shadow-lg shadow-[#E50914]/30"
                >
                  {editingStream ? 'บันทึกการแก้ไข' : 'เพิ่มคู่แข่งขันทันที'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Push Notification Modal */}
      <LiveStreamNotifyModal
        isOpen={isNotifyModalOpen}
        onClose={() => {
          setIsNotifyModalOpen(false);
          setNotifyingStream(null);
        }}
        stream={notifyingStream}
        onSendNotification={handleSendNotificationInternal}
      />
    </div>
  );
};
