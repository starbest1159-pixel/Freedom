import React from 'react';
import { motion } from 'motion/react';
import { X, Keyboard, Command, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: language === 'th' ? 'การนำทางและเมนูหลัก' : 'Navigation & Tabs',
      shortcuts: [
        { key: 'Ctrl + K', desc: language === 'th' ? 'เปิด Command Palette / ค้นหาด่วน' : 'Open Command Palette / Quick Search' },
        { key: 'Ctrl + 1', desc: language === 'th' ? 'ไปยังหน้า จัดการภาพยนตร์' : 'Go to Movies Management' },
        { key: 'Ctrl + 2', desc: language === 'th' ? 'ไปยังหน้า ถ่ายทอดสด & สตรีมมิ่ง' : 'Go to Live Streaming' },
        { key: 'Ctrl + 3', desc: language === 'th' ? 'ไปยังหน้า หมวดหมู่ภาพยนตร์' : 'Go to Movie Categories' },
        { key: 'Ctrl + 4', desc: language === 'th' ? 'ไปยังหน้า ประเภทภาพยนตร์ (Genres)' : 'Go to Movie Genres' },
        { key: 'Ctrl + 5', desc: language === 'th' ? 'ไปยังหน้า แบนเนอร์หน้าหลัก' : 'Go to Home Banners' },
        { key: 'Ctrl + 6', desc: language === 'th' ? 'ไปยังหน้า คลังรูปภาพ (Media)' : 'Go to Media Library' },
        { key: 'Ctrl + 7', desc: language === 'th' ? 'ไปยังหน้า จัดการผู้ใช้งาน' : 'Go to Users Management' },
        { key: 'Ctrl + 8', desc: language === 'th' ? 'ไปยังหน้า ตั้งค่าเว็บไซต์' : 'Go to Site Settings' },
        { key: 'Ctrl + 9', desc: language === 'th' ? 'ไปยังหน้า เนื้อหา SEO' : 'Go to SEO Settings' },
      ],
    },
    {
      title: language === 'th' ? 'คำสั่งด่วนและการทำงาน' : 'Quick Actions & Controls',
      shortcuts: [
        { key: 'Ctrl + U', desc: language === 'th' ? 'สลับบัญชีผู้ใช้งานทันที (Dual Session: admin ⇄ staff)' : 'Toggle Concurrent Active User Session' },
        { key: 'Ctrl + N', desc: language === 'th' ? 'เพิ่มภาพยนตร์ใหม่ทันที' : 'Add New Movie' },
        { key: 'Ctrl + I', desc: language === 'th' ? 'เปิดระบบซิงค์ TMDB API' : 'Sync with TMDB API' },
        { key: 'Ctrl + P', desc: language === 'th' ? 'ดูตัวอย่างหน้าเว็บไซต์สด (Preview)' : 'Live Website Preview' },
        { key: 'Ctrl + B', desc: language === 'th' ? 'ย่อ/ขยาย เมนูด้านข้าง (Sidebar)' : 'Toggle Sidebar Collapse' },
        { key: 'Ctrl + L', desc: language === 'th' ? 'สลับภาษาไทย / อังกฤษ' : 'Toggle Language (TH/EN)' },
        { key: 'ESC', desc: language === 'th' ? 'ปิดหน้าต่างป๊อปอัป / ยกเลิก' : 'Close Active Modal / Cancel' },
        { key: 'Ctrl + /', desc: language === 'th' ? 'เปิดคู่มือคีย์ลัดนี้' : 'Open Shortcuts Guide' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#1A1A1A] border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#222]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#E50914]/20 text-[#E50914]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {language === 'th' ? 'แป้นพิมพ์คีย์ลัดระบบ (Keyboard Shortcuts)' : 'Keyboard Shortcuts Guide'}
              </h3>
              <p className="text-xs text-gray-400">
                {language === 'th' ? 'ควบคุมและสั่งการระบบได้รวดเร็วผ่านแป้นพิมพ์ Control / Command' : 'Supercharge your workflow with instant hotkey controls'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h4 className="text-xs font-bold text-[#E50914] uppercase tracking-wider">
                {group.title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.shortcuts.map((sc, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition"
                  >
                    <span className="text-xs text-gray-300 mr-2">{sc.desc}</span>
                    <kbd className="px-2 py-1 text-[11px] font-mono font-bold bg-[#111] text-white border border-white/20 rounded shadow-inner whitespace-nowrap">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#141414] border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>{language === 'th' ? 'รองรับทั้ง Windows (Ctrl) และ macOS (Cmd ⌘)' : 'Supports Windows (Ctrl) & macOS (Cmd ⌘)'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition"
          >
            {language === 'th' ? 'เข้าใจแล้ว' : 'Got it'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
