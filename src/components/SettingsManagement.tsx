import React, { useState } from 'react';
import {
  Settings,
  Globe,
  FileText,
  HelpCircle,
  PlaySquare,
  LayoutTemplate,
  Network,
  Save,
  Check,
  Plus,
  Trash2,
  Database,
  Key,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Code2,
  Send,
  Copy,
  Terminal,
} from 'lucide-react';
import { SiteSettings, SeoConfig, FAQItem, VideoAd, AdminMenuTab } from '../types';
import {
  validateSeriesJeenKey,
  getStoredSeriesJeenKey,
  setStoredSeriesJeenKey,
  SERIES_JEEN_BASE_URL,
  OPENAPI_SPEC_URL,
} from '../services/seriesJeenService';
import { useLanguage } from '../context/LanguageContext';

interface SettingsManagementProps {
  initialTab?: AdminMenuTab;
  settings: SiteSettings;
  seo: SeoConfig;
  faqs: FAQItem[];
  videoAds: VideoAd[];
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdateSeo: (seo: SeoConfig) => void;
  onUpdateFaqs: (faqs: FAQItem[]) => void;
  onUpdateVideoAds: (ads: VideoAd[]) => void;
}

export const SettingsManagement: React.FC<SettingsManagementProps> = ({
  initialTab = 'settings',
  settings,
  seo,
  faqs,
  videoAds,
  onUpdateSettings,
  onUpdateSeo,
  onUpdateFaqs,
  onUpdateVideoAds,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(
    initialTab === 'seo'
      ? 'seo'
      : initialTab === 'faqs'
      ? 'faqs'
      : initialTab === 'video-ads'
      ? 'ads'
      : initialTab === 'header-menu' || initialTab === 'footer-menu'
      ? 'menus'
      : 'general'
  );

  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteTagline, setSiteTagline] = useState(settings.siteTagline);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [apiKey, setApiKey] = useState(settings.apiKey || getStoredSeriesJeenKey());

  const [metaTitle, setMetaTitle] = useState(seo.metaTitle);
  const [metaDescription, setMetaDescription] = useState(seo.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(seo.metaKeywords);

  const [savedNotice, setSavedNotice] = useState(false);

  // Series Open API Testing state
  const [validatingApi, setValidatingApi] = useState(false);
  const [apiAuthResult, setApiAuthResult] = useState<{
    tested: boolean;
    valid: boolean;
    message: string;
    code: number;
    profile?: any;
  }>({
    tested: false,
    valid: false,
    message: '',
    code: 0,
  });

  // OpenAPI Sandbox State
  const [customEndpoint, setCustomEndpoint] = useState<string>('/health');
  const [testingEndpoint, setTestingEndpoint] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<{
    status?: number;
    statusText?: string;
    latency?: number;
    data?: any;
    error?: string;
    timestamp?: string;
  } | null>(null);
  const [copiedSpec, setCopiedSpec] = useState(false);

  // New FAQ form state
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const triggerSaveNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredSeriesJeenKey(apiKey);
    onUpdateSettings({
      ...settings,
      siteName,
      siteTagline,
      supportEmail,
      maintenanceMode,
      apiKey,
    });
    triggerSaveNotice();
  };

  const handleTestApiKey = async () => {
    setValidatingApi(true);
    const res = await validateSeriesJeenKey(apiKey);
    setApiAuthResult({
      tested: true,
      valid: res.success,
      message: res.message,
      code: res.statusCode,
      profile: res.profile,
    });
    if (res.success) {
      setStoredSeriesJeenKey(apiKey);
    }
    setValidatingApi(false);
  };

  const handleRunSandbox = async () => {
    setTestingEndpoint(true);
    setSandboxResult(null);
    const endpointToCall = customEndpoint.trim().startsWith('/')
      ? customEndpoint.trim()
      : `/${customEndpoint.trim()}`;
    const url = `${SERIES_JEEN_BASE_URL}${endpointToCall}`;
    const start = performance.now();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (apiKey.trim()) {
        headers['Authorization'] = `Bearer ${apiKey.trim()}`;
      }

      const res = await fetch(url, { headers });
      const latency = Math.round(performance.now() - start);
      let data: any;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      setSandboxResult({
        status: res.status,
        statusText: res.statusText,
        latency,
        data,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      const latency = Math.round(performance.now() - start);
      setSandboxResult({
        status: 0,
        statusText: 'Network Error',
        latency,
        error: err.message || 'Cannot reach server',
        timestamp: new Date().toLocaleTimeString(),
      });
    } finally {
      setTestingEndpoint(false);
    }
  };

  const handleCopySpecUrl = () => {
    navigator.clipboard.writeText(OPENAPI_SPEC_URL);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSeo({
      ...seo,
      metaTitle,
      metaDescription,
      metaKeywords,
    });
    triggerSaveNotice();
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;

    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQ.trim(),
      answer: newFaqA.trim(),
      category: language === 'th' ? 'ทั่วไป' : 'General',
      order: faqs.length + 1,
    };
    onUpdateFaqs([...faqs, newFaq]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleDeleteFaq = (id: string) => {
    onUpdateFaqs(faqs.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[#E50914]" />
            {t.settings.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            {t.settings.subtitle}
          </p>
        </div>

        {savedNotice && (
          <div className="bg-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-lg border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 fade-in">
            <Check className="w-4 h-4" />
            <span>{t.common.saved}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'general'
              ? 'bg-[#E50914] text-white shadow-md'
              : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.settings.tabGeneral}</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'api' || activeTab === 'tmdb'
              ? 'bg-white text-black shadow-md'
              : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Series Open API</span>
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'seo'
              ? 'bg-[#E50914] text-white shadow-md'
              : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.settings.tabSeo}</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'faqs'
              ? 'bg-[#E50914] text-white shadow-md'
              : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t.settings.tabFaq}</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'ads'
              ? 'bg-[#E50914] text-white shadow-md'
              : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
          }`}
        >
          <PlaySquare className="w-4 h-4" />
          <span>{t.settings.tabAds}</span>
        </button>

        <button
          onClick={() => setActiveTab('menus')}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'menus'
              ? 'bg-[#E50914] text-white shadow-md'
              : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          <span>{t.settings.tabMenus}</span>
        </button>
      </div>

      {/* Tab 1: General Settings */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-[#1A1A1A] rounded-xl p-6 border border-white/5 space-y-5 shadow-md max-w-2xl text-xs sm:text-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 font-medium mb-1.5">
                {t.settings.siteName}
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1.5">
                {t.settings.siteTagline}
              </label>
              <input
                type="text"
                value={siteTagline}
                onChange={(e) => setSiteTagline(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1.5">
                {t.settings.supportEmail}
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1.5">
                Series Open API Key (https://api.seriesjeen.online)
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="วาง Series Open API Key ของคุณที่นี่..."
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="maintenanceCheck"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-black text-[#E50914] focus:ring-[#E50914]"
              />
              <label htmlFor="maintenanceCheck" className="text-gray-300 cursor-pointer">
                {t.settings.maintenanceMode}
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium px-5 py-2.5 rounded-lg transition flex items-center gap-2 shadow-md shadow-[#28A745]/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.common.save}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Series Open API Specification & OpenAPI Sandbox */}
      {(activeTab === 'api' || activeTab === 'tmdb') && (
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-white/5 space-y-6 shadow-md max-w-4xl text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-white" />
                <span>Series Open API & OpenAPI 3.1.0 Gateway</span>
              </h2>
              <p className="text-gray-400 mt-1">
                {language === 'th'
                  ? 'ระบบเชื่อมต่อ API มาตรฐาน OpenAPI 3.1.0 ครอบคลุม 57 แพลตฟอร์มสตรีมมิ่ง (1,143 Endpoints)'
                  : 'OpenAPI 3.1.0 compliant client covering 57 streaming platforms across 1,143 endpoints.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySpecUrl}
                className="px-3 py-1.5 bg-[#242424] hover:bg-[#2e2e2e] text-gray-200 rounded-lg text-xs flex items-center gap-1.5 border border-white/10 transition"
              >
                {copiedSpec ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSpec ? 'คัดลอกลิงก์แล้ว' : 'คัดลอก openapi.json URL'}</span>
              </button>
              <a
                href={OPENAPI_SPEC_URL}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white text-black font-semibold rounded-lg text-xs flex items-center gap-1.5 hover:bg-gray-200 transition"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>OpenAPI Schema</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#121212] p-3 rounded-xl border border-white/10">
              <span className="text-gray-400 text-[11px] block">OpenAPI Spec</span>
              <span className="text-white font-bold text-sm">Version 3.1.0</span>
            </div>
            <div className="bg-[#121212] p-3 rounded-xl border border-white/10">
              <span className="text-gray-400 text-[11px] block">Total Endpoints</span>
              <span className="text-white font-bold text-sm">1,143 Paths</span>
            </div>
            <div className="bg-[#121212] p-3 rounded-xl border border-white/10">
              <span className="text-gray-400 text-[11px] block">Platforms</span>
              <span className="text-white font-bold text-sm">57 Platforms</span>
            </div>
            <div className="bg-[#121212] p-3 rounded-xl border border-white/10">
              <span className="text-gray-400 text-[11px] block">Auth Scheme</span>
              <span className="text-emerald-400 font-bold text-sm">HTTP Bearer</span>
            </div>
          </div>

          {/* API Key Input & Validate */}
          <div className="space-y-3 bg-[#121212] p-4 rounded-xl border border-white/10">
            <label className="block text-gray-300 font-semibold flex items-center justify-between">
              <span>Series Open API Key (Bearer Token)</span>
              <span className="text-[11px] text-gray-400 font-normal">ไม่ต้องพิมพ์คำว่า Bearer นำหน้า</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="วาง Series Open API Key..."
                className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-white"
              />
              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={validatingApi}
                className="bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-bold px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${validatingApi ? 'animate-spin' : ''}`} />
                <span>{validatingApi ? (language === 'th' ? 'กำลังตรวจสอบ...' : 'Validating...') : t.settings.validateKeyBtn}</span>
              </button>
            </div>

            {/* Validation Feedback */}
            {apiAuthResult.tested && (
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 mt-2 ${
                  apiAuthResult.valid
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {apiAuthResult.valid ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>
                      {apiAuthResult.valid
                        ? (language === 'th' ? 'สิทธิ์การเชื่อมต่อถูกต้อง (Valid Key)' : 'API Key is Valid')
                        : (language === 'th' ? 'การตรวจสอบไม่ผ่าน (Invalid Key)' : 'Authentication Failed')}
                    </span>
                    <span className="font-mono text-[11px] opacity-80">(HTTP: {apiAuthResult.code})</span>
                  </div>
                  <p className="mt-0.5 opacity-90">{apiAuthResult.message}</p>
                  {apiAuthResult.profile && (
                    <div className="mt-1.5 p-2 bg-black/40 rounded-lg text-[11px] font-mono text-gray-300 space-y-0.5">
                      <div>ผู้ใช้: <span className="text-white font-bold">{apiAuthResult.profile.username || 'API User'}</span></div>
                      <div>โควต้าคงเหลือวันนี้ (BKK): <span className="text-emerald-400 font-bold">{apiAuthResult.profile.quota_remaining ?? 'ไม่จำกัด'}</span></div>
                      {apiAuthResult.profile.plan && <div>แพ็กเกจ: <span className="text-yellow-400">{apiAuthResult.profile.plan}</span></div>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* OpenAPI Technical Specifications Card */}
          <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-white" />
                Series Open API Live Endpoints Map
              </span>
              <a
                href="https://api.seriesjeen.online/docs"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:underline flex items-center gap-1 text-xs font-semibold"
              >
                <span>api.seriesjeen.online/docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-[#181818] rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-gray-300">/health</span>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                  {language === 'th' ? 'ตรวจสอบสถานะ Uptime และฐานข้อมูล' : 'System Uptime & DB Ping'}
                </p>
              </div>
              <div className="p-2.5 bg-[#181818] rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-gray-300">/api/platforms/health</span>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                  {language === 'th' ? 'สถานะ Online/Offline ของ 57 แพลตฟอร์ม' : '57 Platforms Realtime Health'}
                </p>
              </div>
              <div className="p-2.5 bg-[#181818] rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-gray-300">/api/platform/thaidub/list</span>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                  {language === 'th' ? 'คลังซีรีส์พากย์ไทยพร้อมดูทุกตอน' : 'Thai-Dubbed Dramas Ready to Stream'}
                </p>
              </div>
              <div className="p-2.5 bg-[#181818] rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-gray-300">/api/platform/{'{platform}'}/list</span>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                  {language === 'th' ? 'ดึงซีรีส์ตามชื่อแพลตฟอร์ม (ShortMax, DramaBox...)' : 'Dramas by Platform Name'}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive OpenAPI Sandbox Tester */}
          <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-white" />
                <span>OpenAPI Interactive Sandbox (Live Request Tester)</span>
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                Base URL: https://api.seriesjeen.online
              </span>
            </div>

            {/* Quick Preset Selector */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'GET /health', path: '/health' },
                { label: 'GET /api/platforms/health', path: '/api/platforms/health' },
                { label: 'GET /api/me', path: '/api/me' },
                { label: 'GET /api/me/access', path: '/api/me/access' },
                { label: 'GET /api/platform/thaidub/list', path: '/api/platform/thaidub/list?page=1&page_size=5' },
                { label: 'GET /api/platform/thaidub/platforms', path: '/api/platform/thaidub/platforms' },
                { label: 'GET /api/platform/thaidub/genres', path: '/api/platform/thaidub/genres' },
                { label: 'GET /api/platform/shortmax/list', path: '/api/platform/shortmax/list?page=1&page_size=5' },
                { label: 'GET /api/platform/dramabox/list', path: '/api/platform/dramabox/list?page=1&page_size=5' },
                { label: 'GET /openapi.json', path: '/openapi.json' },
              ].map((preset) => (
                <button
                  key={preset.path}
                  type="button"
                  onClick={() => {
                    setCustomEndpoint(preset.path);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${
                    customEndpoint === preset.path
                      ? 'bg-white text-black font-bold'
                      : 'bg-[#1e1e1e] text-gray-300 hover:text-white hover:bg-[#282828] border border-white/5'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Input & Execute */}
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-[#1A1A1A] border border-white/10 rounded-lg overflow-hidden">
                <span className="px-3 py-2 text-xs font-bold text-emerald-400 bg-white/5 border-r border-white/10 font-mono">
                  GET
                </span>
                <input
                  type="text"
                  value={customEndpoint}
                  onChange={(e) => setCustomEndpoint(e.target.value)}
                  placeholder="/health หรือ /api/platform/thaidub/list..."
                  className="flex-1 bg-transparent px-3 py-2 text-white font-mono text-xs focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleRunSandbox}
                disabled={testingEndpoint}
                className="bg-white hover:bg-gray-200 disabled:opacity-50 text-black font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow text-xs shrink-0"
              >
                {testingEndpoint ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{testingEndpoint ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

            {/* Sandbox Response Output */}
            {sandboxResult && (
              <div className="bg-[#0A0A0A] p-3.5 rounded-lg border border-white/10 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        sandboxResult.status === 200
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      Status: {sandboxResult.status} {sandboxResult.statusText}
                    </span>
                    <span className="text-gray-400">
                      Latency: <strong className="text-white">{sandboxResult.latency}ms</strong>
                    </span>
                  </div>
                  <span className="text-gray-500">{sandboxResult.timestamp}</span>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <pre className="text-gray-300 text-[11px] leading-relaxed">
                    {sandboxResult.error
                      ? JSON.stringify({ error: sandboxResult.error }, null, 2)
                      : JSON.stringify(sandboxResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveGeneral}
              className="bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium px-5 py-2.5 rounded-lg transition flex items-center gap-2 shadow-md shadow-[#28A745]/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.common.save}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: SEO Configuration */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSeo} className="bg-[#1A1A1A] rounded-xl p-6 border border-white/5 space-y-5 shadow-md max-w-2xl text-xs sm:text-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 font-medium mb-1.5">
                {t.settings.metaTitle}
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1.5">
                {t.settings.metaDescription}
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1.5">
                {t.settings.metaKeywords}
              </label>
              <input
                type="text"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium px-5 py-2.5 rounded-lg transition flex items-center gap-2 shadow-md shadow-[#28A745]/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.common.save}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: FAQs Management */}
      {activeTab === 'faqs' && (
        <div className="space-y-6 max-w-3xl">
          {/* Add FAQ Form */}
          <form onSubmit={handleAddFaq} className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 space-y-3 shadow-md">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              {t.settings.addFaqBtn}
            </h3>
            <div className="space-y-2">
              <input
                type="text"
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                placeholder={language === 'th' ? 'ระบุคำถาม...' : 'Enter question...'}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E50914]"
              />
              <textarea
                rows={2}
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                placeholder={language === 'th' ? 'ระบุคำตอบ...' : 'Enter answer...'}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-1.5 rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.settings.addFaqBtn}</span>
            </button>
          </form>

          {/* List of existing FAQs */}
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5 flex items-start justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="text-[#0071EB]">Q:</span>
                    <span>{faq.question}</span>
                  </div>
                  <div className="text-gray-400 flex items-start gap-2 pt-0.5">
                    <span className="text-emerald-400 font-bold">A:</span>
                    <span>{faq.answer}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                  title={t.common.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Video Ads */}
      {activeTab === 'ads' && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">
              {language === 'th' ? 'รายการวิดีโอโฆษณาที่ติดตั้งในระบบ' : 'Installed Video Advertisements'}
            </h3>
          </div>

          <div className="space-y-3">
            {videoAds.map((ad) => (
              <div
                key={ad.id}
                className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-white">{ad.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ad.active
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {ad.active ? (language === 'th' ? 'กำลังเปิดใช้งาน' : 'Active') : (language === 'th' ? 'ปิดชั่วคราว' : 'Disabled')}
                  </span>
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                  <div>
                    {language === 'th' ? 'สปอนเซอร์:' : 'Sponsor:'} <strong className="text-white">{ad.sponsorName}</strong>
                  </div>
                  <div>
                    {language === 'th' ? 'ตำแหน่ง:' : 'Placement:'} <span className="text-[#0071EB] uppercase">{ad.placement}</span>{' '}
                    ({language === 'th' ? `ข้ามได้หลัง ${ad.skipAfterSeconds} วินาที` : `Skippable after ${ad.skipAfterSeconds}s`})
                  </div>
                  <div className="flex items-center gap-4 pt-1 font-mono text-[11px]">
                    <span>{language === 'th' ? 'ยอดดู:' : 'Impressions:'} {ad.impressions.toLocaleString()}</span>
                    <span>{language === 'th' ? 'ยอดคลิก:' : 'Clicks:'} {ad.clicks.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Header & Footer Menus */}
      {activeTab === 'menus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 space-y-3 shadow-md">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-[#0071EB]" />
              {language === 'th' ? 'ลิงก์เมนูส่วนหัว (Header Navigation)' : 'Header Navigation Links'}
            </h3>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="p-2.5 bg-[#0F0F0F] rounded-lg flex justify-between items-center border border-white/5">
                <span>{language === 'th' ? 'หน้าแรก' : 'Home'}</span>
                <span className="text-gray-500 font-mono">/home</span>
              </li>
              <li className="p-2.5 bg-[#0F0F0F] rounded-lg flex justify-between items-center border border-white/5">
                <span>{language === 'th' ? 'ภาพยนตร์ทั้งหมด' : 'All Movies'}</span>
                <span className="text-gray-500 font-mono">/movies</span>
              </li>
              <li className="p-2.5 bg-[#0F0F0F] rounded-lg flex justify-between items-center border border-white/5">
                <span>{language === 'th' ? 'ซีรีส์ & หนังชุด' : 'Series & TV Shows'}</span>
                <span className="text-gray-500 font-mono">/series</span>
              </li>
              <li className="p-2.5 bg-[#0F0F0F] rounded-lg flex justify-between items-center border border-white/5">
                <span>{language === 'th' ? 'มาใหม่ & ยอดฮิต' : 'Trending & Popular'}</span>
                <span className="text-gray-500 font-mono">/popular</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 space-y-3 shadow-md">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-[#E50914]" />
              {language === 'th' ? 'ลิงก์เมนูส่วนท้าย (Footer Sitemap)' : 'Footer Sitemap Links'}
            </h3>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="p-2.5 bg-[#0F0F0F] rounded-lg flex justify-between items-center border border-white/5">
                <span>{language === 'th' ? 'คำถามที่พบบ่อย' : 'FAQ'}</span>
                <span className="text-gray-500 font-mono">/faq</span>
              </li>
              <li className="p-2.5 bg-[#0F0F0F] rounded-lg flex justify-between items-center border border-white/5">
                <span>{language === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}</span>
                <span className="text-gray-500 font-mono">/privacy</span>
              </li>
              <li className="p-2.5 bg-[#0F0F0F] rounded-lg flex justify-between items-center border border-white/5">
                <span>{language === 'th' ? 'ข้อกำหนดการใช้งาน' : 'Terms of Service'}</span>
                <span className="text-gray-500 font-mono">/terms</span>
              </li>
              <li className="p-2.5 bg-[#0F0F0F] rounded-lg flex justify-between items-center border border-white/5">
                <span>{language === 'th' ? 'ติดต่อผู้ดูแลระบบ' : 'Contact Support'}</span>
                <span className="text-gray-500 font-mono">/contact</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
