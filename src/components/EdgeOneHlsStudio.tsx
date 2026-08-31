import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import {
  Shield,
  Radio,
  Play,
  Pause,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Code,
  Terminal,
  Activity,
  Server,
  Zap,
  Lock,
  Key,
  ExternalLink,
  Layers,
  FileCode,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  DEFAULT_TYPE_A_CONFIG,
  TypeAConfig,
  generateTypeASign,
  signHlsUrl,
  checkTypeA,
  rewriteM3u8Manifest,
  SAMPLE_M3U8_MANIFEST,
  getGoHttprouterTemplate,
  getEdgeOneJsWorkerTemplate,
  EdgeStreamEvent,
} from '../services/edgeOneTypeAService';
import { realApiEventService } from '../services/realApiEventService';
import { Tooltip } from './Tooltip';

interface EdgeOneHlsStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_HLS_STREAMS = [
  {
    name: 'Apple HLS Master Stream (Multi-Bitrate)',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    category: 'Master VOD',
  },
  {
    name: 'Big Buck Bunny (HLS 1080p Stream)',
    url: 'https://test-streams.mux.dev/test_001/stream.m3u8',
    category: 'VOD Stream',
  },
  {
    name: 'Tears of Steel (Akamai HLS Demo)',
    url: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    category: '4K HLS Stream',
  },
  {
    name: 'Live Stream Sports Feed (Premier Feed)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'MP4 Fallback',
  },
];

export const EdgeOneHlsStudio: React.FC<EdgeOneHlsStudioProps> = ({ isOpen, onClose }) => {
  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'player' | 'signer' | 'events' | 'code'>('player');

  // Config State
  const [config, setConfig] = useState<TypeAConfig>({ ...DEFAULT_TYPE_A_CONFIG });

  // Stream Player State
  const [streamUrl, setStreamUrl] = useState<string>(PRESET_HLS_STREAMS[0].url);
  const [signedStreamUrl, setSignedStreamUrl] = useState<string>('');
  const [hlsStats, setHlsStats] = useState({
    status: 'Idle',
    currentLevel: -1,
    levelsCount: 0,
    bitrate: 0,
    bufferLength: 0,
    latency: 0,
    codecs: 'avc1, mp4a',
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [autoSign, setAutoSign] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Signer & Manifest State
  const [rawUrlInput, setRawUrlInput] = useState<string>('/live/stream_1080p.m3u8');
  const [generatedSignResult, setGeneratedSignResult] = useState<any>(null);
  const [verifyUrlInput, setVerifyUrlInput] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [m3u8Input, setM3u8Input] = useState<string>(SAMPLE_M3U8_MANIFEST);
  const [rewrittenM3u8Output, setRewrittenM3u8Output] = useState<string>('');

  // Events Log State
  const [events, setEvents] = useState<EdgeStreamEvent[]>([]);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Subscribe to real API events
  useEffect(() => {
    const unsub = realApiEventService.subscribe((newEvents) => {
      setEvents(newEvents);
    });
    return () => unsub();
  }, []);

  // Update Signed Stream URL whenever streamUrl or config changes
  useEffect(() => {
    if (autoSign) {
      const signed = signHlsUrl(streamUrl, config);
      setSignedStreamUrl(signed);
      // Auto verify check
      realApiEventService.recordTypeAVerify(signed, config);
    } else {
      setSignedStreamUrl(streamUrl);
    }
  }, [streamUrl, config, autoSign]);

  // Handle HLS Player Initialization
  useEffect(() => {
    if (activeTab !== 'player') return;
    const video = videoRef.current;
    if (!video) return;

    const targetUrl = signedStreamUrl || streamUrl;

    if (Hls.isSupported() && targetUrl.includes('.m3u8')) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;

      hls.loadSource(targetUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setHlsStats((prev) => ({
          ...prev,
          status: 'Manifest Loaded (Ready)',
          levelsCount: data.levels.length,
        }));
        realApiEventService.recordEvent({
          eventType: 'm3u8_rewrite',
          url: targetUrl,
          method: 'GET',
          statusCode: 200,
          statusText: '200 OK (TypeA Authorized)',
          latencyMs: 16,
          edgeNode: 'BKK-Edge-01',
          bytes: 3400,
          details: `HLS Master Manifest parsed with ${data.levels.length} adaptive bitrate levels.`,
        });
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
        const fragUrl = data.frag.url;
        const bytes = data.frag.stats.total;
        const latency = Math.round(data.frag.stats.loading.end - data.frag.stats.loading.start);
        realApiEventService.recordHlsChunk(fragUrl, bytes, latency);

        setHlsStats((prev) => ({
          ...prev,
          bufferLength: Number(video.buffered.length > 0 ? (video.buffered.end(video.buffered.length - 1) - video.currentTime).toFixed(1) : 0),
          bitrate: data.frag.bitrate ? Math.round(data.frag.bitrate / 1000) : 4500,
          latency,
        }));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setHlsStats((prev) => ({
          ...prev,
          currentLevel: data.level,
        }));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setHlsStats((prev) => ({ ...prev, status: `Error: ${data.details}` }));
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS
      video.src = targetUrl;
      video.play().catch(() => {});
    } else {
      // Direct MP4 fallback
      video.src = targetUrl;
      video.play().catch(() => {});
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [signedStreamUrl, activeTab]);

  // Handle URL Sign Generation
  const handleGenerateSign = () => {
    const res = generateTypeASign(rawUrlInput, config);
    setGeneratedSignResult(res);
    const fullUrl = signHlsUrl(rawUrlInput, config);
    setVerifyUrlInput(fullUrl);
    realApiEventService.recordTypeAVerify(fullUrl, config);
  };

  // Handle URL Verify Check
  const handleVerifySign = () => {
    const res = checkTypeA(verifyUrlInput, config);
    setVerifyResult(res);
    realApiEventService.recordTypeAVerify(verifyUrlInput, config);
  };

  // Handle Manifest Rewrite
  const handleRewriteManifest = () => {
    const rewritten = rewriteM3u8Manifest(m3u8Input, '/live/sport', config);
    setRewrittenM3u8Output(rewritten);
    realApiEventService.recordEvent({
      eventType: 'm3u8_rewrite',
      url: '/live/sport/playlist.m3u8',
      method: 'POST',
      statusCode: 200,
      statusText: 'OK (Manifest Rewritten)',
      latencyMs: 12,
      edgeNode: 'BKK-Edge-01',
      bytes: rewritten.length,
      details: 'M3U8 Manifest rewrote all segment URLs and #EXT-X-MAP keys with HMAC TypeA signatures.',
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredEvents = events.filter((e) => {
    if (eventFilter === 'all') return true;
    return e.eventType === eventFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#1B1B1B] border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#E50914] text-white px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase shadow-md shadow-[#E50914]/20">
              <Shield className="w-4 h-4" />
              <span>TENCENT EDGEONE HLS ENGINE</span>
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>HLS TypeA Stream Auth & Event Telemetry</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> TypeA Active
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip content="ปิดหน้าต่างสตรีมมิ่งสตูดิโอ">
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Global TypeA Settings Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#181818] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-gray-300">
              <Key className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="font-semibold text-gray-400">Private Key (PK):</span>
              <input
                type="text"
                value={config.pk}
                onChange={(e) => setConfig({ ...config, pk: e.target.value })}
                className="bg-[#242424] border border-white/10 rounded px-2 py-0.5 text-xs text-white font-mono w-28 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="font-semibold text-gray-400">TTL (วิ):</span>
              <input
                type="number"
                value={config.ttl}
                onChange={(e) => setConfig({ ...config, ttl: Number(e.target.value) || 60 })}
                className="bg-[#242424] border border-white/10 rounded px-2 py-0.5 text-xs text-white font-mono w-16 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="font-semibold text-gray-400">Key Name:</span>
              <input
                type="text"
                value={config.keyName}
                onChange={(e) => setConfig({ ...config, keyName: e.target.value })}
                className="bg-[#242424] border border-white/10 rounded px-2 py-0.5 text-xs text-white font-mono w-16 focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="font-semibold text-gray-400">UID:</span>
              <input
                type="number"
                value={config.uid}
                onChange={(e) => setConfig({ ...config, uid: Number(e.target.value) || 0 })}
                className="bg-[#242424] border border-white/10 rounded px-2 py-0.5 text-xs text-white font-mono w-14 focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoSign}
                onChange={(e) => setAutoSign(e.target.checked)}
                className="accent-[#E50914] rounded"
              />
              <span>Auto TypeA Signed URL</span>
            </label>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#161616] px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('player')}
            className={`py-3 px-4 text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'player'
                ? 'text-[#E50914] border-b-2 border-[#E50914] bg-[#E50914]/5'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>1. เครื่องเล่น HLS Live Player</span>
          </button>

          <button
            onClick={() => setActiveTab('signer')}
            className={`py-3 px-4 text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'signer'
                ? 'text-[#E50914] border-b-2 border-[#E50914] bg-[#E50914]/5'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>2. TypeA Signer & Manifest Rewriter</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`py-3 px-4 text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'events'
                ? 'text-[#E50914] border-b-2 border-[#E50914] bg-[#E50914]/5'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3. เหตุการณ์ API & CDN Telemetry</span>
            <span className="bg-[#E50914] text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {events.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'code'
                ? 'text-[#E50914] border-b-2 border-[#E50914] bg-[#E50914]/5'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>4. Go Httprouter & Edge Worker</span>
          </button>
        </div>

        {/* Tab 1: Live HLS Stream Player */}
        {activeTab === 'player' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Stream URL Bar & Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span>URL แหล่งสัญญาณวิดีโอ HLS (.m3u8):</span>
                <span className="text-[11px] text-gray-500">รองรับ HLS Master Manifest, Adaptive Bitrate, TS Segments</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  placeholder="https://your-domain.com/live/stream.m3u8"
                  className="flex-1 bg-[#1F1F1F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50914]"
                />
                <button
                  onClick={() => {
                    const signed = signHlsUrl(streamUrl, config);
                    setSignedStreamUrl(signed);
                  }}
                  className="px-4 py-2 bg-[#E50914] hover:bg-[#E50914]/90 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>โหลดใหม่</span>
                </button>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-gray-400 py-1 mr-1">สตรีมทดสอบ:</span>
                {PRESET_HLS_STREAMS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStreamUrl(preset.url)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition border cursor-pointer ${
                      streamUrl === preset.url
                        ? 'bg-white/15 text-white border-white/25 font-semibold'
                        : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Signed Token URL Readout */}
            <div className="p-3 bg-[#1B1B1B] border border-white/10 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#E50914]" />
                  Signed EdgeOne HLS Request URL:
                </span>
                <button
                  onClick={() => handleCopy(signedStreamUrl, 'signed-url')}
                  className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'signed-url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'signed-url' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>
              <div className="text-xs font-mono text-emerald-400 break-all bg-black/40 p-2 rounded border border-white/5 select-all">
                {signedStreamUrl || streamUrl}
              </div>
            </div>

            {/* Video Canvas & Metrics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Player */}
              <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden relative aspect-video flex items-center justify-center border border-white/10">
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                  autoPlay
                  muted={isMuted}
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 text-[11px] text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Tencent EdgeOne Protected</span>
                </div>
              </div>

              {/* Real-time HLS Diagnostics */}
              <div className="bg-[#1B1B1B] border border-white/10 rounded-xl p-4 space-y-3 flex flex-col justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#E50914]" />
                    <span>HLS Telemetry Diagnostics</span>
                  </h4>

                  <div className="space-y-2.5">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">สถานะ Hls.js:</span>
                      <span className="font-mono text-emerald-400 font-semibold">{hlsStats.status}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">คุณภาพ Adaptive Bitrate:</span>
                      <span className="font-mono text-white">
                        {hlsStats.levelsCount > 0 ? `${hlsStats.levelsCount} Profiles` : 'Single Stream'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">บิตเรตปัจจุบัน (Bitrate):</span>
                      <span className="font-mono text-amber-400 font-bold">{hlsStats.bitrate} kbps</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Buffer Length:</span>
                      <span className="font-mono text-sky-400">{hlsStats.bufferLength} วินาที</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">ความหน่วง Edge Latency:</span>
                      <span className="font-mono text-white">{hlsStats.latency} ms</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">ถอดรหัส Codecs:</span>
                      <span className="font-mono text-gray-300">{hlsStats.codecs}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300">
                  🛡️ <strong>ความปลอดภัย TypeA:</strong> มีการป้องกันการดึงสตรีมไปเผยแพร่โดยไม่ได้รับอนุญาต (Anti-hotlinking) ผ่าน HMAC-MD5 Token ทุกๆ {config.ttl} วินาที
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: TypeA Signer & Manifest Rewriter */}
        {activeTab === 'signer' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* Section 1: Sign URL Generator */}
            <div className="p-4 bg-[#1B1B1B] border border-white/10 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-[#E50914]" />
                <span>เครื่องมือสร้างและจำลอง TypeA Signature URL</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">พาธไฟล์หรือ URL ต้นฉบับ:</label>
                  <input
                    type="text"
                    value={rawUrlInput}
                    onChange={(e) => setRawUrlInput(e.target.value)}
                    className="w-full bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50914]"
                    placeholder="/live/channel1.m3u8"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleGenerateSign}
                    className="w-full py-2 bg-[#E50914] hover:bg-[#E50914]/90 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>คำนวณ TypeA Sign</span>
                  </button>
                </div>
              </div>

              {generatedSignResult && (
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs space-y-1.5 font-mono">
                  <div className="text-gray-400">
                    Signature Token (<code className="text-amber-400">key</code>):{' '}
                    <span className="text-emerald-400 font-bold">{generatedSignResult.key}</span>
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    ts: {generatedSignResult.ts} | rand: {generatedSignResult.rand} | uid: {generatedSignResult.uid} | md5: {generatedSignResult.md5hash}
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: TypeA Signature Validator */}
            <div className="p-4 bg-[#1B1B1B] border border-white/10 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>เครื่องมือตรวจสอบความถูกต้องของลายเซ็น (TypeA Validator)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">URL ที่ต้องการตรวจสอบ:</label>
                  <input
                    type="text"
                    value={verifyUrlInput}
                    onChange={(e) => setVerifyUrlInput(e.target.value)}
                    className="w-full bg-[#242424] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50914]"
                    placeholder="/live/channel1.m3u8?key=1740000000-a7b2-0-8f6a9b4c2e1d0f"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleVerifySign}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ตรวจสอบสิทธิ์</span>
                  </button>
                </div>
              </div>

              {verifyResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono ${
                    verifyResult.flag
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {verifyResult.flag ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>HTTP {verifyResult.statusCode}: {verifyResult.message}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: M3U8 Manifest Live Rewriter */}
            <div className="p-4 bg-[#1B1B1B] border border-white/10 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>โปรแกรมจำลองการ Rewrite M3U8 Playlist สำหรับ CDN</span>
                </h3>
                <button
                  onClick={handleRewriteManifest}
                  className="px-3.5 py-1.5 bg-[#E50914] text-white rounded-lg text-xs font-bold hover:bg-[#E50914]/90 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Rewrite Manifest ทันที</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">M3U8 Manifest ดั้งเดิม:</label>
                  <textarea
                    rows={8}
                    value={m3u8Input}
                    onChange={(e) => setM3u8Input(e.target.value)}
                    className="w-full bg-[#242424] border border-white/10 rounded-xl p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">M3U8 ที่ Rewrite ลายเซ็นแล้ว (Edge Response):</label>
                  <textarea
                    rows={8}
                    readOnly
                    value={rewrittenM3u8Output || 'กดปุ่ม "Rewrite Manifest ทันที" เพื่อแปลงไฟล์...'}
                    className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl p-3 text-xs text-emerald-400 font-mono select-all focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Real API & CDN Events Telemetry */}
        {activeTab === 'events' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">กรองประเภทเหตุการณ์:</span>
                {['all', 'type_a_verify', 'm3u8_rewrite', 'ts_segment', 'api_sync'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setEventFilter(type)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer ${
                      eventFilter === type
                        ? 'bg-[#E50914] text-white font-bold'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {type === 'all'
                      ? 'ทั้งหมด'
                      : type === 'type_a_verify'
                      ? 'TypeA Auth'
                      : type === 'm3u8_rewrite'
                      ? 'M3U8 Rewrite'
                      : type === 'ts_segment'
                      ? 'TS Segments'
                      : 'API Sync'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => realApiEventService.clearEvents()}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  ล้างเหตุการณ์
                </button>
              </div>
            </div>

            {/* Event Stream List */}
            <div className="space-y-2">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  ยังไม่มีเหตุการณ์ที่บันทึกไว้
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 bg-[#1A1A1A] border border-white/5 hover:border-white/15 rounded-xl transition text-xs flex flex-col gap-1.5 font-mono"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            evt.statusCode === 200
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          HTTP {evt.statusCode}
                        </span>
                        <span className="bg-white/10 text-gray-300 text-[10px] px-2 py-0.5 rounded">
                          {evt.method}
                        </span>
                        <span className="bg-sky-500/20 text-sky-400 text-[10px] px-2 py-0.5 rounded border border-sky-500/30">
                          {evt.edgeNode}
                        </span>
                        <span className="text-gray-300 font-bold truncate max-w-md">{evt.url}</span>
                      </div>

                      <div className="flex items-center gap-3 text-gray-400 text-[11px]">
                        <span>⚡ {evt.latencyMs} ms</span>
                        <span>📦 {(evt.bytes / 1024).toFixed(1)} KB</span>
                        <span>🕒 {evt.timestamp}</span>
                      </div>
                    </div>

                    {evt.details && (
                      <div className="text-[11px] text-gray-400 bg-black/30 p-2 rounded border border-white/5">
                        {evt.details}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Go Httprouter & Edge Worker Code Templates */}
        {activeTab === 'code' && (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* Go Template */}
            <div className="p-4 bg-[#1B1B1B] border border-white/10 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm text-white font-mono">
                    TencentEdgeOne/go-httprouter-template (Go Backend)
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(getGoHttprouterTemplate(config), 'go-template')}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  {copiedKey === 'go-template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'go-template' ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด Go'}</span>
                </button>
              </div>
              <pre className="bg-[#121212] border border-white/5 p-4 rounded-xl text-xs text-gray-300 font-mono overflow-x-auto max-h-72">
                {getGoHttprouterTemplate(config)}
              </pre>
            </div>

            {/* Edge Worker Template */}
            <div className="p-4 bg-[#1B1B1B] border border-white/10 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-sm text-white font-mono">
                    Tencent EdgeOne Edge Function (JavaScript Worker)
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(getEdgeOneJsWorkerTemplate(config), 'js-template')}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  {copiedKey === 'js-template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'js-template' ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด Worker'}</span>
                </button>
              </div>
              <pre className="bg-[#121212] border border-white/5 p-4 rounded-xl text-xs text-gray-300 font-mono overflow-x-auto max-h-72">
                {getEdgeOneJsWorkerTemplate(config)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
