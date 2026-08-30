import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Eye, Check, Power } from 'lucide-react';
import { Banner } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BannersManagementProps {
  banners: Banner[];
  onUpdateBanners: (banners: Banner[]) => void;
}

export const BannersManagement: React.FC<BannersManagementProps> = ({
  banners,
  onUpdateBanners,
}) => {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badgeText, setBadgeText] = useState('แนะนำพิเศษ');

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const newBanner: Banner = {
      id: `ban-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      imageUrl: imageUrl.trim(),
      badgeText: badgeText.trim() || undefined,
      active: true,
      order: banners.length + 1,
    };

    onUpdateBanners([...banners, newBanner]);
    setTitle('');
    setSubtitle('');
    setImageUrl('');
  };

  const toggleBannerStatus = (id: string) => {
    onUpdateBanners(
      banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  const handleDeleteBanner = (id: string) => {
    onUpdateBanners(banners.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <ImageIcon className="w-6 h-6 text-[#E50914]" />
          {t.banners.pageTitle}
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          {t.banners.pageSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 h-fit shadow-md">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#28A745]" />
            {t.banners.addBannerBtn}
          </h2>

          <form onSubmit={handleAddBanner} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {t.banners.bannerTitle} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น หลานม่า (2024)"
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {t.banners.bannerSubtitle}
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="เช่น ภาพยนตร์ที่สร้างปรากฏการณ์น้ำตาทั่วเอเชีย"
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {t.banners.badgeText}
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="เช่น อันดับ 1 สัปดาห์นี้"
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {t.banners.imageUrl} (16:9) *
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.banners.addBannerBtn}</span>
            </button>
          </form>
        </div>

        {/* Banners List */}
        <div className="lg:col-span-2 space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/5 shadow-md flex flex-col md:flex-row group"
            >
              <div className="md:w-64 aspect-video relative overflow-hidden bg-black/50 shrink-0">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                {banner.badgeText && (
                  <span className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {banner.badgeText}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-white">{banner.title}</h3>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        banner.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {banner.active ? (language === 'th' ? 'กำลังแสดง' : 'Active') : (language === 'th' ? 'ปิดการแสดง' : 'Inactive')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{banner.subtitle}</p>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={() => toggleBannerStatus(banner.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                      banner.active
                        ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{banner.active ? (language === 'th' ? 'ปิดใช้งาน' : 'Disable') : (language === 'th' ? 'เปิดใช้งาน' : 'Enable')}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.common.delete}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
