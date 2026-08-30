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
} from 'lucide-react';
import { SiteSettings, SeoConfig, FAQItem, VideoAd, AdminMenuTab } from '../types';
import {
  validateTMDBKey,
  getStoredApiKey,
  setStoredApiKey,
} from '../services/tmdbService';
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
  const [apiKey, setApiKey] = useState(settings.apiKey || getStoredApiKey());

  const [metaTitle, setMetaTitle] = useState(seo.metaTitle);
  const [metaDescription, setMetaDescription] = useState(seo.metaDescription);
  const [metaKeywords, setMetaKeywords] = useState(seo.metaKeywords);

  const [savedNotice, setSavedNotice] = useState(false);

  // TMDB Testing state
  const [validatingTmdb, setValidatingTmdb] = useState(false);
  const [tmdbAuthResult, setTmdbAuthResult] = useState<{
    tested: boolean;
    valid: boolean;
    message: string;
    code: number;
  }>({
    tested: false,
    valid: false,
    message: '',
    code: 0,
  });

  // New FAQ form state
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const triggerSaveNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKey);
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

  const handleTestTmdbKey = async () => {
    setValidatingTmdb(true);
    const res = await validateTMDBKey(apiKey);
    setTmdbAuthResult({
      tested: true,
      valid: res.success,
      message: res.message,
      code: res.statusCode,
    });
    if (res.success) {
      setStoredApiKey(apiKey);
    }
    setValidatingTmdb(false);
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
          onClick={() => setActiveTab('tmdb')}
          className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'tmdb'
              ? 'bg-[#0071EB] text-white shadow-md shadow-[#0071EB]/20'
              : 'bg-[#1A1A1A] text-gray-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4 text-cyan-400" />
          <span>{t.settings.tabTmdb}</span>
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
                {t.settings.tmdbApiKey}
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#E50914]"
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

      {/* Tab 2: TMDB API & OpenAPI Specification */}
      {activeTab === 'tmdb' && (
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-white/5 space-y-6 shadow-md max-w-3xl text-xs sm:text-sm">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0071EB]" />
              <span>The Movie Database (TMDB) API v3 Configuration</span>
            </h2>
            <p className="text-gray-400 mt-1">
              {t.settings.tmdbLiveStatus}
            </p>
          </div>

          {/* API Key Input & Validate */}
          <div className="space-y-3 bg-[#121212] p-4 rounded-xl border border-white/10">
            <label className="block text-gray-300 font-semibold">
              {t.settings.tmdbApiKey}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="TMDB API Key..."
                className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-lg px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#0071EB]"
              />
              <button
                type="button"
                onClick={handleTestTmdbKey}
                disabled={validatingTmdb}
                className="bg-[#0071EB] hover:bg-[#0071EB]/90 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0071EB]/20 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${validatingTmdb ? 'animate-spin' : ''}`} />
                <span>{validatingTmdb ? (language === 'th' ? 'กำลังตรวจสอบ...' : 'Validating...') : t.settings.validateKeyBtn}</span>
              </button>
            </div>

            {/* Validation Feedback */}
            {tmdbAuthResult.tested && (
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 mt-2 ${
                  tmdbAuthResult.valid
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {tmdbAuthResult.valid ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>
                      {tmdbAuthResult.valid
                        ? (language === 'th' ? 'สิทธิ์การเชื่อมต่อถูกต้อง (Valid Key)' : 'API Key is Valid')
                        : (language === 'th' ? 'การตรวจสอบไม่ผ่าน (Invalid Key)' : 'Authentication Failed')}
                    </span>
                    <span className="font-mono text-[11px] opacity-80">(Code: {tmdbAuthResult.code})</span>
                  </div>
                  <p className="mt-0.5 opacity-90">{tmdbAuthResult.message}</p>
                </div>
              </div>
            )}
          </div>

          {/* OpenAPI Technical Specifications Card */}
          <div className="bg-[#121212] p-4 rounded-xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                OpenAPI 3.1.0 Endpoints Map
              </span>
              <a
                href="https://developer.themoviedb.org/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="text-[#0071EB] hover:underline flex items-center gap-1 text-xs font-semibold"
              >
                <span>developer.themoviedb.org/llms.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-[#181818] rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-gray-300">/3/authentication</span>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                  {language === 'th' ? 'ทดสอบความถูกต้องของ API Key' : 'Validate API Key'}
                </p>
              </div>
              <div className="p-2.5 bg-[#181818] rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-gray-300">/3/movie/now_playing</span>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                  {language === 'th' ? 'ภาพยนตร์กำลังฉายในโรง' : 'Movies Now Playing'}
                </p>
              </div>
              <div className="p-2.5 bg-[#181818] rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-gray-300">/3/movie/popular</span>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                  {language === 'th' ? 'ภาพยนตร์ยอดนิยมประจำสัปดาห์' : 'Popular Movies'}
                </p>
              </div>
              <div className="p-2.5 bg-[#181818] rounded-lg border border-white/5">
                <span className="text-emerald-400 font-bold">GET</span>{' '}
                <span className="text-gray-300">/3/search/movie</span>
                <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                  {language === 'th' ? 'ค้นหาภาพยนตร์ตามคีย์เวิร์ด' : 'Search Movies by Keyword'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
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
