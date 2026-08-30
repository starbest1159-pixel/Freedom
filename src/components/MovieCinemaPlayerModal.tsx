import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  Settings,
  Server,
  Film,
  Star,
  Clock,
  Sparkles,
  Subtitles,
  AudioWaveform,
  Tv,
  Share2,
  Check,
  ChevronRight,
  ListPlus,
  Heart,
  PictureInPicture,
} from 'lucide-react';
import { Movie } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MovieCinemaPlayerModalProps {
  movie: Movie | null;
  allMovies?: Movie[];
  isOpen: boolean;
  onClose: () => void;
  onSelectOtherMovie?: (movie: Movie) => void;
}

interface MovieServer {
  id: string;
  name: string;
  quality: string;
  url: string;
  audio: string;
  sub: string;
}

const DEFAULT_SERVERS: Record<string, MovieServer[]> = {
  default: [
    {
      id: 'srv-4k',
      name: 'Server 1 - Movieflix Master (4K HDR)',
      quality: '4K 2160p',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      audio: 'พากย์ไทย (Master 5.1)',
      sub: 'ซับไทย / English',
    },
    {
      id: 'srv-fhd',
      name: 'Server 2 - Fast CDN (1080p ลื่นไหล)',
      quality: 'FHD 1080p',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      audio: 'เสียงต้นฉบับ Sound Track (ENG)',
      sub: 'ซับไทย (Official TH)',
    },
    {
      id: 'srv-backup',
      name: 'Server 3 - สำรองความเร็วสูง (720p เน็ตช้า)',
      quality: 'HD 720p',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      audio: 'พากย์ไทย + เสียงอังกฤษ',
      sub: 'ปิดคำบรรยาย',
    },
  ],
};

export const MovieCinemaPlayerModal: React.FC<MovieCinemaPlayerModalProps> = ({
  movie,
  allMovies = [],
  isOpen,
  onClose,
  onSelectOtherMovie,
}) => {
  if (!isOpen || !movie) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Available servers for this movie
  const servers: MovieServer[] = React.useMemo(() => {
    const customUrl = movie.streamUrl || movie.trailerUrl;
    const baseList: MovieServer[] = [
      {
        id: 'srv-master',
        name: 'Server 1 - Movieflix Super 4K Master',
        quality: movie.quality || '4K UHD',
        url:
          customUrl ||
          (movie.id === 'mov-1'
            ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
            : movie.id === 'mov-2'
            ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
            : movie.id === 'mov-3'
            ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            : movie.id === 'mov-4'
            ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
            : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'),
        audio: 'พากย์ไทย (Master 5.1)',
        sub: 'ซับไทย / English',
      },
      {
        id: 'srv-cdn-fhd',
        name: 'Server 2 - Google CDN 1080p',
        quality: '1080p 60FPS',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        audio: 'เสียงต้นฉบับ English (Dolby Atmos)',
        sub: 'ซับไตเติลภาษาไทย',
      },
      {
        id: 'srv-backup',
        name: 'Server 3 - สำรองความเร็วสูง (ประหยัดเน็ต)',
        quality: '720p Fast',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        audio: 'พากย์ไทย (บรรยาย)',
        sub: 'ปิดคำบรรยาย',
      },
    ];
    return baseList;
  }, [movie]);

  const [selectedServer, setSelectedServer] = useState<MovieServer>(servers[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [selectedAudio, setSelectedAudio] = useState('th'); // 'th' | 'en'
  const [selectedSubtitle, setSelectedSubtitle] = useState('th'); // 'th' | 'en' | 'off'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSideTab, setActiveSideTab] = useState<'info' | 'servers' | 'playlist'>('info');

  // Reset states when movie changes
  useEffect(() => {
    if (servers.length > 0) {
      setSelectedServer(servers[0]);
    }
    setCurrentTime(0);
    setIsPlaying(true);
    setIsSettingsOpen(false);
  }, [movie, servers]);

  // Handle Video Time Updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!duration || isNaN(duration)) {
        setDuration(videoRef.current.duration || 0);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      videoRef.current.playbackRate = playbackSpeed;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      const nextTime = Math.min(Math.max(0, videoRef.current.currentTime + seconds), duration || 9999);
      videoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
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

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setIsSettingsOpen(false);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleTogglePiP = async () => {
    try {
      if (videoRef.current) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setIsSettingsOpen(false);
      }
    }, 3500);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSkip(10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSkip(-10);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isFullscreen, duration]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const otherMovies = allMovies.filter((m) => m.id !== movie.id).slice(0, 8);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onMouseMove={handleMouseMove}
    >
      {/* Ambient Cinema Lighting Glow effect behind the container */}
      {ambientGlow && (
        <div
          className="absolute inset-0 pointer-events-none opacity-25 blur-3xl transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 40%, #E50914 0%, #1e1b4b 50%, transparent 80%)`,
          }}
        />
      )}

      <div
        ref={containerRef}
        className="relative w-full max-w-7xl bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#181818] border-b border-white/10 shrink-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 bg-[#E50914] text-white px-2.5 py-0.5 rounded text-xs font-black tracking-wider uppercase shadow-md shadow-[#E50914]/20">
              <Film className="w-3.5 h-3.5" />
              <span>MOVIEFLIX PLAYER</span>
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base text-white truncate flex items-center gap-2">
                <span>{movie.title}</span>
                {movie.year && (
                  <span className="text-xs font-normal text-gray-400">({movie.year})</span>
                )}
                <span className="bg-white/10 text-yellow-400 text-[11px] font-bold px-1.5 py-0.2 rounded border border-white/10 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {movie.rating.toFixed(1)}
                </span>
                <span className="bg-[#E50914]/20 text-[#E50914] text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-[#E50914]/30">
                  {movie.quality}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAmbientGlow(!ambientGlow)}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition cursor-pointer ${
                ambientGlow
                  ? 'bg-[#E50914]/20 text-[#E50914] border-[#E50914]/40'
                  : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
              }`}
              title="สลับโหมดแสงเรืองรอบโรงภาพยนตร์ (Ambient Glow)"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Cinema Glow</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer border border-white/5"
              title="แชร์ลิงก์ภาพยนตร์"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-[#E50914] text-gray-300 hover:text-white transition cursor-pointer"
              title="ปิดเครื่องเล่น"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Video Player on Left, Side Panel on Right */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Video Player Canvas */}
          <div className="flex-1 flex flex-col bg-black relative justify-center items-center overflow-hidden group select-none">
            <video
              ref={videoRef}
              src={selectedServer.url}
              className="w-full h-full max-h-[70vh] lg:max-h-full object-contain bg-black cursor-pointer"
              autoPlay
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onClick={handleTogglePlay}
            />

            {/* Subtitle Display Simulation on Screen */}
            {selectedSubtitle !== 'off' && (
              <div className="absolute bottom-20 inset-x-0 text-center pointer-events-none z-20 px-6">
                <span className="bg-black/75 text-yellow-300 font-medium text-sm sm:text-base px-4 py-1.5 rounded-lg shadow-lg border border-black/50 backdrop-blur-xs">
                  {selectedSubtitle === 'th'
                    ? '「 บรรยายไทย: ความคมชัดระดับ 4K มาสเตอร์ Movieflix 」'
                    : '「 English Subtitle: Welcome to Movieflix Cinema Experience 」'}
                </span>
              </div>
            )}

            {/* Center Big Play Button when paused */}
            {!isPlaying && (
              <button
                onClick={handleTogglePlay}
                className="absolute z-30 p-6 rounded-full bg-[#E50914]/90 hover:bg-[#E50914] text-white hover:scale-110 transition shadow-2xl cursor-pointer"
              >
                <Play className="w-10 h-10 fill-white translate-x-1" />
              </button>
            )}

            {/* Top Video Overlay: Current Server & Quality Badge */}
            <div
              className={`absolute top-4 left-4 z-30 flex items-center gap-2 transition-opacity duration-300 pointer-events-none ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-md border border-white/10 flex items-center gap-1.5 shadow-lg">
                <Server className="w-3.5 h-3.5 text-[#E50914]" />
                {selectedServer.name}
              </span>
              <span className="bg-[#E50914]/90 text-white text-xs font-extrabold px-2 py-1 rounded-md shadow-lg">
                {selectedServer.quality}
              </span>
              <span className="bg-black/60 text-gray-300 text-xs px-2.5 py-1 rounded-md border border-white/10 hidden sm:inline-block">
                {selectedAudio === 'th' ? '🔊 พากย์ไทย 5.1' : '🔊 Sound Track (ENG)'}
              </span>
            </div>

            {/* Bottom Custom Netflix-Style Control Bar */}
            <div
              className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-4 sm:px-6 py-4 flex flex-col gap-2.5 z-30 transition-opacity duration-300 ${
                showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Progress Scrubber */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-300 min-w-[45px]">
                  {formatTime(currentTime)}
                </span>
                <div className="relative flex-1 group/slider flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full accent-[#E50914] h-1.5 bg-white/25 rounded-lg cursor-pointer transition-all hover:h-2.5"
                  />
                </div>
                <span className="text-xs font-mono text-gray-400 min-w-[45px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white text-xs sm:text-sm">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={handleTogglePlay}
                    className="p-1.5 hover:text-[#E50914] transition cursor-pointer"
                    title={isPlaying ? 'หยุดชั่วคราว (Space)' : 'เล่นต่อ (Space)'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current" />
                    )}
                  </button>

                  {/* Skip Rewind 10s */}
                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-1.5 hover:text-[#E50914] transition cursor-pointer text-gray-300 hover:text-white"
                    title="ย้อนกลับ 10 วินาที (Left Arrow)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Skip Forward 10s */}
                  <button
                    onClick={() => handleSkip(10)}
                    className="p-1.5 hover:text-[#E50914] transition cursor-pointer text-gray-300 hover:text-white"
                    title="ไปข้างหน้า 10 วินาที (Right Arrow)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2 group/vol">
                    <button
                      onClick={handleToggleMute}
                      className="p-1.5 hover:text-[#E50914] transition cursor-pointer"
                      title={isMuted ? 'เปิดเสียง (M)' : 'ปิดเสียง (M)'}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-5 h-5 text-red-400" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
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

                  {/* Audio & Subtitle Quick Tags */}
                  <div className="hidden md:flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAudio(selectedAudio === 'th' ? 'en' : 'th')}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-gray-200 transition cursor-pointer flex items-center gap-1 border border-white/10"
                      title="สลับภาษาเสียงพากย์"
                    >
                      <AudioWaveform className="w-3.5 h-3.5 text-[#E50914]" />
                      <span>{selectedAudio === 'th' ? 'TH พากย์ไทย' : 'ENG Soundtrack'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (selectedSubtitle === 'th') setSelectedSubtitle('en');
                        else if (selectedSubtitle === 'en') setSelectedSubtitle('off');
                        else setSelectedSubtitle('th');
                      }}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-gray-200 transition cursor-pointer flex items-center gap-1 border border-white/10"
                      title="สลับคำบรรยาย (Subtitles)"
                    >
                      <Subtitles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>
                        {selectedSubtitle === 'th'
                          ? 'ซับไทย (TH)'
                          : selectedSubtitle === 'en'
                          ? 'Sub (ENG)'
                          : 'ปิดซับ'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Playback Speed selector */}
                  <div className="relative">
                    <button
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-gray-200 transition cursor-pointer flex items-center gap-1 border border-white/10"
                      title="ตั้งค่าความเร็วและคุณภาพ"
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-300" />
                      <span>{playbackSpeed}x</span>
                    </button>

                    {/* Settings Dropdown Popover */}
                    {isSettingsOpen && (
                      <div className="absolute right-0 bottom-full mb-3 w-48 bg-[#1F1F1F] border border-white/15 rounded-xl shadow-2xl p-2.5 z-40 text-xs space-y-2">
                        <div className="font-bold text-gray-300 pb-1 border-b border-white/10 flex items-center justify-between">
                          <span>ความเร็วการเล่น (Speed)</span>
                          <span className="text-[#E50914]">{playbackSpeed}x</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                            <button
                              key={spd}
                              onClick={() => handleSpeedChange(spd)}
                              className={`py-1 rounded text-center transition cursor-pointer ${
                                playbackSpeed === spd
                                  ? 'bg-[#E50914] text-white font-bold'
                                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
                              }`}
                            >
                              {spd}x
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Picture-in-Picture */}
                  <button
                    onClick={handleTogglePiP}
                    className="p-1.5 hover:text-[#E50914] transition cursor-pointer text-gray-300 hover:text-white hidden sm:block"
                    title="เล่นหน้าต่างลอย (Picture in Picture)"
                  >
                    <PictureInPicture className="w-5 h-5" />
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={handleToggleFullscreen}
                    className="p-1.5 hover:text-[#E50914] transition cursor-pointer text-gray-300 hover:text-white"
                    title="เต็มหน้าจอ (F)"
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Panel: Movie Details & Stream Server Selector */}
          <div className="w-full lg:w-96 bg-[#161616] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0">
            {/* Tabs Header */}
            <div className="flex border-b border-white/10 bg-[#1A1A1A]">
              <button
                onClick={() => setActiveSideTab('info')}
                className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSideTab === 'info'
                    ? 'text-[#E50914] border-b-2 border-[#E50914] bg-[#E50914]/5'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>เรื่องย่อ & นักแสดง</span>
              </button>

              <button
                onClick={() => setActiveSideTab('servers')}
                className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSideTab === 'servers'
                    ? 'text-[#E50914] border-b-2 border-[#E50914] bg-[#E50914]/5'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>เซิร์ฟเวอร์ ({servers.length})</span>
              </button>

              <button
                onClick={() => setActiveSideTab('playlist')}
                className={`flex-1 py-3 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeSideTab === 'playlist'
                    ? 'text-[#E50914] border-b-2 border-[#E50914] bg-[#E50914]/5'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>หนังแนะนำ</span>
              </button>
            </div>

            {/* Tab 1: Movie Info */}
            {activeSideTab === 'info' && (
              <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
                <div>
                  <h3 className="font-bold text-lg text-white leading-snug">{movie.title}</h3>
                  {movie.titleEn && <p className="text-xs text-gray-400 mt-0.5">{movie.titleEn}</p>}
                </div>

                {/* Rating & Details Pill */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="bg-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-md font-bold flex items-center gap-1 border border-yellow-500/30">
                    <Star className="w-3.5 h-3.5 fill-yellow-400" />
                    <span>{movie.rating.toFixed(1)} / 10</span>
                  </div>
                  <span className="bg-white/10 text-gray-300 px-2 py-1 rounded-md font-medium">
                    ปี {movie.year}
                  </span>
                  <span className="bg-white/10 text-gray-300 px-2 py-1 rounded-md font-medium">
                    {movie.duration || '115 นาที'}
                  </span>
                  <span className="bg-[#E50914]/20 text-[#E50914] px-2 py-1 rounded-md font-bold border border-[#E50914]/30">
                    {movie.quality}
                  </span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-1.5">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="bg-white/5 border border-white/10 text-gray-300 px-2.5 py-0.5 rounded-full text-[11px]"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Synopsis */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    เรื่องย่อ (Synopsis)
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed bg-[#1F1F1F] p-3 rounded-xl border border-white/5">
                    {movie.description || 'ไม่มีข้อมูลเรื่องย่อสำหรับภาพยนตร์เรื่องนี้'}
                  </p>
                </div>

                {/* Cast & Director */}
                <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                  {movie.director && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 font-semibold min-w-[70px]">ผู้กำกับ:</span>
                      <span className="text-white font-medium">{movie.director}</span>
                    </div>
                  )}
                  {movie.cast && movie.cast.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 font-semibold min-w-[70px]">นักแสดง:</span>
                      <span className="text-gray-300">{movie.cast.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 font-semibold min-w-[70px]">รหัสหนัง:</span>
                    <span className="text-gray-400 font-mono">{movie.code}</span>
                  </div>
                </div>

                {/* Favorite Toggle Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer border ${
                    isFavorite
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFavorite ? 'บันทึกในรายการโปรดแล้ว' : 'เพิ่มในรายการโปรด'}</span>
                </button>
              </div>
            )}

            {/* Tab 2: Stream Servers */}
            {activeSideTab === 'servers' && (
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
                <div className="text-xs text-gray-400 pb-2">
                  หากพบปัญหาภาพกระตุกหรือไม่โหลด สามารถสลับเซิร์ฟเวอร์สำรองด้านล่างได้ทันที:
                </div>

                {servers.map((srv, idx) => {
                  const isCurrent = selectedServer.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedServer(srv);
                        setIsPlaying(true);
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col gap-1.5 ${
                        isCurrent
                          ? 'bg-[#E50914]/15 border-[#E50914] text-white shadow-lg shadow-[#E50914]/10'
                          : 'bg-[#1F1F1F] border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs flex items-center gap-2">
                          <Server
                            className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#E50914]' : 'text-gray-400'}`}
                          />
                          <span>{srv.name}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isCurrent
                              ? 'bg-[#E50914] text-white'
                              : 'bg-white/10 text-gray-400'
                          }`}
                        >
                          {srv.quality}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                        <span>🔊 {srv.audio}</span>
                        <span>💬 {srv.sub}</span>
                      </div>
                    </div>
                  );
                })}

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 leading-relaxed mt-4">
                  💡 <strong>คำแนะนำ:</strong> สำหรับอุปกรณ์มือถือที่ใช้อินเทอร์เน็ตความเร็วจำกัด
                  แนะนำให้เลือก <strong>Server 3 (720p)</strong> เพื่อความลื่นไหลสูงสุด
                </div>
              </div>
            )}

            {/* Tab 3: Playlist & Recommended */}
            {activeSideTab === 'playlist' && (
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
                <div className="text-xs text-gray-400 pb-1">ภาพยนตร์น่ารับชมต่อ:</div>

                {otherMovies.length === 0 ? (
                  <div className="text-xs text-gray-500 text-center py-8">
                    ไม่มีภาพยนตร์แนะนำเพิ่มเติม
                  </div>
                ) : (
                  otherMovies.map((other) => (
                    <div
                      key={other.id}
                      onClick={() => {
                        if (onSelectOtherMovie) onSelectOtherMovie(other);
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl bg-[#1F1F1F] hover:bg-white/10 border border-white/5 transition cursor-pointer group"
                    >
                      <div className="w-14 h-20 rounded-lg overflow-hidden bg-black/50 shrink-0 relative">
                        <img
                          src={other.poster}
                          alt={other.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <Play className="w-5 h-5 fill-white text-white" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-white truncate group-hover:text-[#E50914] transition">
                          {other.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                          <span className="text-yellow-400 font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" />
                            {other.rating.toFixed(1)}
                          </span>
                          <span>•</span>
                          <span>{other.year}</span>
                          <span>•</span>
                          <span className="text-[#E50914] font-semibold">{other.quality}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 line-clamp-1 mt-1">
                          {other.category}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white shrink-0" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
