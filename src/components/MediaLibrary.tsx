import React, { useState } from 'react';
import { ImagePlus, Upload, Copy, Check, Trash2, Search, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  dimensions: string;
  size: string;
  date: string;
}

export const MediaLibrary: React.FC = () => {
  const { t, language } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: 'med-1',
      name: 'banner_grandma_4k.webp',
      url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1600',
      dimensions: '1920x1080',
      size: '420 KB',
      date: '2025-02-15',
    },
    {
      id: 'med-2',
      name: 'poster_dune2_uhd.jpg',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
      dimensions: '600x900',
      size: '180 KB',
      date: '2025-02-10',
    },
    {
      id: 'med-3',
      name: 'poster_teeyod2.jpg',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600',
      dimensions: '600x900',
      size: '210 KB',
      date: '2025-01-28',
    },
    {
      id: 'med-4',
      name: 'poster_joy_ivf.jpg',
      url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600',
      dimensions: '600x900',
      size: '165 KB',
      date: '2025-01-14',
    },
  ]);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      dimensions: '1200x800',
      size: `${(file.size / 1024).toFixed(0)} KB`,
      date: new Date().toISOString().split('T')[0],
    };

    setMediaItems([newItem, ...mediaItems]);
  };

  const handleDelete = (id: string) => {
    setMediaItems(mediaItems.filter((m) => m.id !== id));
  };

  const filtered = mediaItems.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ImagePlus className="w-6 h-6 text-[#E50914]" />
            {t.media.pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            {t.media.pageSubtitle}
          </p>
        </div>

        <label className="bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium px-4 py-2.5 rounded-lg text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition shadow-md shadow-[#28A745]/20 self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>{t.media.uploadBtn}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadSimulate}
            className="hidden"
          />
        </label>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'th' ? 'ค้นหาชื่อไฟล์รูปภาพ...' : 'Search image filename...'}
          className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#E50914]"
        />
      </div>

      {/* Grid of images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-white/5 shadow-md flex flex-col group"
          >
            <div className="aspect-video relative bg-black/60 overflow-hidden">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-2 left-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] text-gray-300">
                {item.dimensions}
              </span>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between text-xs">
              <div>
                <p className="font-semibold text-white truncate" title={item.name}>
                  {item.name}
                </p>
                <div className="flex items-center justify-between text-gray-400 text-[11px] mt-1">
                  <span>{item.size}</span>
                  <span>{item.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 mt-2 border-t border-white/5">
                <button
                  onClick={() => handleCopy(item.url, item.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    copiedId === item.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.common.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t.common.copyLink}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition cursor-pointer"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
