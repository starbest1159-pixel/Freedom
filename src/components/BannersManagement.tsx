import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  Check,
  Power,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Sparkles,
  ExternalLink,
  Edit3,
  RotateCcw,
  Info,
  CheckCircle2,
  X,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { Banner } from '../types';
import { INITIAL_BANNERS } from '../data/initialData';
import { useLanguage } from '../context/LanguageContext';
import { Tooltip } from './Tooltip';

interface BannersManagementProps {
  banners: Banner[];
  onUpdateBanners: (banners: Banner[]) => void;
  onOpenPreview?: () => void;
}

export const BannersManagement: React.FC<BannersManagementProps> = ({
  banners,
  onUpdateBanners,
  onOpenPreview,
}) => {
  const { t, language } = useLanguage();

  // New Banner Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badgeText, setBadgeText] = useState('แนะนำพิเศษ');
  const [actionUrl, setActionUrl] = useState('#');

  // Edit Banner State
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggedItemHeight, setDraggedItemHeight] = useState<number | null>(null);

  // Status Notification / Feedback
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Re-index orders sequentially
  const normalizeOrders = (list: Banner[]): Banner[] => {
    return list.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Measure element height for placeholder sizing
    const target = e.currentTarget;
    if (target) {
      setDraggedItemHeight(target.clientHeight);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDraggedItemHeight(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      handleDragEnd();
      return;
    }

    const updated = [...banners];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);

    const reordered = normalizeOrders(updated);
    onUpdateBanners(reordered);
    showStatus(
      language === 'th'
        ? `จัดลำดับแบนเนอร์ใหม่: "${draggedItem.title}" อยู่ที่อันดับ #${targetIndex + 1} แล้ว`
        : `Reordered: "${draggedItem.title}" is now at position #${targetIndex + 1}`
    );
    handleDragEnd();
  };

  // 1-Click Move Handlers
  const handleMove = (index: number, direction: 'up' | 'down' | 'top' | 'bottom') => {
    const updated = [...banners];
    const [item] = updated.splice(index, 1);

    if (direction === 'up' && index > 0) {
      updated.splice(index - 1, 0, item);
    } else if (direction === 'down' && index < banners.length - 1) {
      updated.splice(index + 1, 0, item);
    } else if (direction === 'top') {
      updated.unshift(item);
    } else if (direction === 'bottom') {
      updated.push(item);
    } else {
      return;
    }

    const reordered = normalizeOrders(updated);
    onUpdateBanners(reordered);
    showStatus(
      language === 'th'
        ? `เปลี่ยนลำดับ "${item.title}" เรียบร้อยแล้ว`
        : `Moved "${item.title}" successfully`
    );
  };

  // Add Banner
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const newBanner: Banner = {
      id: `ban-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      imageUrl: imageUrl.trim(),
      badgeText: badgeText.trim() || undefined,
      actionUrl: actionUrl.trim() || '#',
      active: true,
      order: banners.length + 1,
    };

    const updated = normalizeOrders([...banners, newBanner]);
    onUpdateBanners(updated);
    setTitle('');
    setSubtitle('');
    setImageUrl('');
    setBadgeText('แนะนำพิเศษ');
    setActionUrl('#');
    showStatus(
      language === 'th'
        ? `เพิ่มแบนเนอร์ "${newBanner.title}" สำเร็จ (อันดับ #${updated.length})`
        : `Added banner "${newBanner.title}" successfully`
    );
  };

  // Toggle Banner Status
  const toggleBannerStatus = (id: string) => {
    const updated = banners.map((b) =>
      b.id === id ? { ...b, active: !b.active } : b
    );
    onUpdateBanners(updated);
    const target = banners.find((b) => b.id === id);
    if (target) {
      showStatus(
        target.active
          ? (language === 'th' ? `ปิดการแสดงผลแบนเนอร์ "${target.title}"` : `Disabled banner "${target.title}"`)
          : (language === 'th' ? `เปิดการแสดงผลแบนเนอร์ "${target.title}"` : `Enabled banner "${target.title}"`)
      );
    }
  };

  // Delete Banner
  const handleDeleteBanner = (id: string) => {
    const target = banners.find((b) => b.id === id);
    const filtered = banners.filter((b) => b.id !== id);
    const reordered = normalizeOrders(filtered);
    onUpdateBanners(reordered);
    showStatus(
      language === 'th'
        ? `ลบแบนเนอร์ "${target?.title || ''}" เรียบร้อยแล้ว`
        : `Deleted banner "${target?.title || ''}"`
    );
  };

  // Save Edited Banner
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    const updated = banners.map((b) =>
      b.id === editingBanner.id ? editingBanner : b
    );
    onUpdateBanners(updated);
    showStatus(
      language === 'th'
        ? `บันทึกการแก้ไขแบนเนอร์ "${editingBanner.title}" แล้ว`
        : `Saved edits for "${editingBanner.title}"`
    );
    setEditingBanner(null);
  };

  // Reset to default banners
  const handleResetBanners = () => {
    if (
      window.confirm(
        language === 'th'
          ? 'ต้องการรีเซ็ตแบนเนอร์กลับเป็นค่าเริ่มต้นใช่หรือไม่?'
          : 'Reset banners to default list?'
      )
    ) {
      onUpdateBanners(INITIAL_BANNERS);
      showStatus(
        language === 'th'
          ? 'รีเซ็ตแบนเนอร์เป็นค่าเริ่มต้นแล้ว'
          : 'Reset banners to default'
      );
    }
  };

  const activeBannersCount = banners.filter((b) => b.active).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-[#E50914]" />
            <span>{t.banners.pageTitle}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            {t.banners.pageSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPreview && (
            <button
              onClick={onOpenPreview}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-white/10 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#E50914]" />
              <span>{t.header.previewSite}</span>
            </button>
          )}

          <button
            onClick={handleResetBanners}
            className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border border-white/5 cursor-pointer"
            title="Reset to default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">
              {language === 'th' ? 'คืนค่าเริ่มต้น' : 'Reset'}
            </span>
          </button>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      {statusMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 bg-[#1A1A1A] text-white px-4 py-3 rounded-xl border border-emerald-500/50 shadow-2xl shadow-black flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Summary Banner Bar & Drag Tip */}
      <div className="bg-[#151515] rounded-xl p-3.5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <ArrowUpDown className="w-4 h-4 text-[#E50914]" />
          </div>
          <div>
            <span className="font-bold text-white block">
              {language === 'th' ? 'ระบบจัดลำดับแบบลากและวาง (Drag & Drop)' : 'Visual Drag-and-Drop Reordering'}
            </span>
            <span className="text-gray-400 text-[11px]">
              {language === 'th'
                ? 'ลากที่ปุ่มจับ (Grip) เพื่อสลับตำแหน่ง หรือใช้ปุ่มลูกศรเพื่อเลื่อนลำดับการแสดงผลในหน้าแรกทันที'
                : 'Drag the grip handles to visually reorder homepage slides or use quick arrow controls.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-gray-300 font-mono text-[11px]">
            {language === 'th' ? 'กำลังแสดงผล' : 'Active'}:{' '}
            <span className="text-emerald-400 font-bold">{activeBannersCount}</span> / {banners.length} {language === 'th' ? 'รายการ' : 'items'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Add New Banner */}
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

            <div className="grid grid-cols-2 gap-2">
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
                  {language === 'th' ? 'ลิงก์เป้าหมาย' : 'Target URL'}
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="#"
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-1">
                {t.banners.imageUrl} (16:9 แนวนอน) *
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

            {/* Quick Preview Image Box */}
            {imageUrl.trim() && (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black/60 border border-white/10 mt-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                {badgeText && (
                  <span className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {badgeText}
                  </span>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="text-white font-bold text-xs truncate">
                    {title || (language === 'th' ? 'ตัวอย่างชื่อภาพยนตร์' : 'Banner Title Preview')}
                  </div>
                  <div className="text-gray-300 text-[10px] truncate">
                    {subtitle || (language === 'th' ? 'คำบรรยายแบนเนอร์' : 'Subtitle Preview')}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.banners.addBannerBtn}</span>
            </button>
          </form>
        </div>

        {/* Banners List with Drag and Drop */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1 text-xs text-gray-400">
            <span>
              {language === 'th'
                ? `รายการแบนเนอร์ทั้งหมด (${banners.length})`
                : `All Banners (${banners.length})`}
            </span>
            <span className="text-[11px] text-gray-500">
              {language === 'th'
                ? 'เรียงจากบนลงล่าง (#1 = ภาพยนตร์หลักบนหน้าแรก)'
                : 'Top to bottom (#1 = Hero Slide)'}
            </span>
          </div>

          {banners.length === 0 ? (
            <div className="bg-[#1A1A1A] rounded-xl p-8 text-center border border-white/5 text-gray-400">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-medium text-gray-300">
                {language === 'th' ? 'ยังไม่มีแบนเนอร์ในระบบ' : 'No banners available'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'th'
                  ? 'เพิ่มแบนเนอร์ใหม่จากแบบฟอร์มด้านซ้าย หรือคลิกคืนค่าเริ่มต้น'
                  : 'Add a new banner or reset to default list.'}
              </p>
            </div>
          ) : (
            banners.map((banner, index) => {
              const isDragged = draggedIndex === index;
              const isDragOver = dragOverIndex === index && draggedIndex !== index;
              const isFirst = index === 0;
              const isLast = index === banners.length - 1;

              return (
                <div
                  key={banner.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`relative bg-[#1A1A1A] rounded-xl overflow-hidden border transition-all duration-200 flex flex-col md:flex-row group ${
                    isDragged
                      ? 'opacity-40 scale-[0.98] border-dashed border-[#E50914] shadow-2xl'
                      : isDragOver
                      ? 'border-[#E50914] bg-[#221616] scale-[1.01] shadow-xl shadow-red-500/10'
                      : 'border-white/5 hover:border-white/20 shadow-md'
                  }`}
                >
                  {/* Visual Drop Insertion Line */}
                  {isDragOver && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-[#E50914] z-20 animate-pulse" />
                  )}

                  {/* Drag Handle & Order Pill Bar */}
                  <div className="bg-[#141414] px-3 py-3 md:py-0 border-b md:border-b-0 md:border-r border-white/5 flex md:flex-col items-center justify-between md:justify-center gap-2 shrink-0 select-none">
                    <Tooltip
                      content={
                        language === 'th'
                          ? 'คลิกค้างแล้วลากเพื่อสลับลำดับ'
                          : 'Click and drag to reorder'
                      }
                      position="right"
                    >
                      <div className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5">
                        <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
                      </div>
                    </Tooltip>

                    {/* Order Number Badge */}
                    <div
                      className={`font-mono text-xs font-black px-2 py-0.5 rounded-md text-center ${
                        isFirst
                          ? 'bg-[#E50914] text-white shadow-md shadow-red-600/30'
                          : 'bg-white/10 text-gray-300'
                      }`}
                      title={isFirst ? 'อันดับ 1 (Hero Main Slide)' : `อันดับที่ ${index + 1}`}
                    >
                      #{index + 1}
                    </div>

                    {/* Quick Move Up / Down Buttons */}
                    <div className="flex md:flex-col items-center gap-1">
                      <Tooltip content={language === 'th' ? 'เลื่อนขึ้น' : 'Move Up'} position="top">
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'up')}
                          disabled={isFirst}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:text-gray-400 hover:bg-white/10 rounded cursor-pointer transition disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </Tooltip>

                      <Tooltip content={language === 'th' ? 'เลื่อนลง' : 'Move Down'} position="bottom">
                        <button
                          type="button"
                          onClick={() => handleMove(index, 'down')}
                          disabled={isLast}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:text-gray-400 hover:bg-white/10 rounded cursor-pointer transition disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="md:w-56 aspect-video relative overflow-hidden bg-black/50 shrink-0">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    {banner.badgeText && (
                      <span className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        {banner.badgeText}
                      </span>
                    )}

                    {isFirst && (
                      <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs text-yellow-400 border border-yellow-400/30 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 fill-yellow-400" />
                        <span>HERO BANNER</span>
                      </span>
                    )}
                  </div>

                  {/* Info & Action Controls */}
                  <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-white truncate flex items-center gap-2">
                            <span>{banner.title}</span>
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {banner.subtitle || (
                              <span className="text-gray-600 italic">
                                {language === 'th' ? 'ไม่มีคำบรรยาย' : 'No description'}
                              </span>
                            )}
                          </p>
                        </div>

                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold shrink-0 ${
                            banner.active
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-white/5'
                          }`}
                        >
                          {banner.active
                            ? language === 'th'
                              ? 'กำลังแสดง'
                              : 'Active'
                            : language === 'th'
                            ? 'ปิดการแสดง'
                            : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-white/5 text-xs">
                      {/* Move to Extreme Jump Buttons */}
                      <div className="flex items-center gap-1">
                        <Tooltip
                          content={language === 'th' ? 'ย้ายไปบนสุด (#1)' : 'Move to Top (#1)'}
                          position="top"
                        >
                          <button
                            type="button"
                            onClick={() => handleMove(index, 'top')}
                            disabled={isFirst}
                            className="p-1 px-1.5 text-[11px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-400 transition cursor-pointer flex items-center gap-1"
                          >
                            <ChevronsUp className="w-3 h-3" />
                            <span className="hidden sm:inline">
                              {language === 'th' ? 'บนสุด' : 'Top'}
                            </span>
                          </button>
                        </Tooltip>

                        <Tooltip
                          content={
                            language === 'th'
                              ? `ย้ายไปล่างสุด (#${banners.length})`
                              : `Move to Bottom (#${banners.length})`
                          }
                          position="top"
                        >
                          <button
                            type="button"
                            onClick={() => handleMove(index, 'bottom')}
                            disabled={isLast}
                            className="p-1 px-1.5 text-[11px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-gray-400 transition cursor-pointer flex items-center gap-1"
                          >
                            <ChevronsDown className="w-3 h-3" />
                            <span className="hidden sm:inline">
                              {language === 'th' ? 'ล่างสุด' : 'Bottom'}
                            </span>
                          </button>
                        </Tooltip>
                      </div>

                      {/* Edit, Status Toggle, Delete Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingBanner(banner)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition flex items-center gap-1 cursor-pointer border border-white/5"
                        >
                          <Edit3 className="w-3 h-3 text-blue-400" />
                          <span>{language === 'th' ? 'แก้ไข' : 'Edit'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleBannerStatus(banner.id)}
                          className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                            banner.active
                              ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>
                            {banner.active
                              ? language === 'th'
                                ? 'ปิดใช้งาน'
                                : 'Disable'
                              : language === 'th'
                              ? 'เปิดใช้งาน'
                              : 'Enable'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="px-2.5 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition flex items-center gap-1 cursor-pointer border border-red-500/20"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{t.common.delete}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#E50914]" />
                <span>{language === 'th' ? 'แก้ไขข้อมูลแบนเนอร์' : 'Edit Banner Details'}</span>
              </h3>
              <button
                onClick={() => setEditingBanner(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {t.banners.bannerTitle} *
                </label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, title: e.target.value })
                  }
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
                  value={editingBanner.subtitle}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, subtitle: e.target.value })
                  }
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    {t.banners.badgeText}
                  </label>
                  <input
                    type="text"
                    value={editingBanner.badgeText || ''}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, badgeText: e.target.value })
                    }
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">
                    {language === 'th' ? 'ลิงก์เป้าหมาย' : 'Target URL'}
                  </label>
                  <input
                    type="text"
                    value={editingBanner.actionUrl || '#'}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, actionUrl: e.target.value })
                    }
                    className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {t.banners.imageUrl} *
                </label>
                <input
                  type="text"
                  value={editingBanner.imageUrl}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, imageUrl: e.target.value })
                  }
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
                  required
                />
              </div>

              {/* Preview in Edit Modal */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10 mt-2">
                <img
                  src={editingBanner.imageUrl}
                  alt={editingBanner.title}
                  className="w-full h-full object-cover"
                />
                {editingBanner.badgeText && (
                  <span className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {editingBanner.badgeText}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#E50914]/90 text-white font-medium transition cursor-pointer shadow-lg"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
