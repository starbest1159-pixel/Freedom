import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Movie } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  movie: Movie | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  movie,
}) => {
  const { t, language } = useLanguage();
  if (!isOpen || !movie) return null;

  const displayTitle = language === 'en' && movie.titleEn ? movie.titleEn : movie.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#1A1A1A] border border-red-500/30 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl fade-in p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{t.deleteConfirm.title}</h3>
        <p className="text-sm text-gray-400 mb-4">
          {language === 'th' ? (
            <>คุณต้องการลบภาพยนตร์ <strong className="text-white">"{displayTitle}"</strong> (รหัส {movie.code}) ออกจากระบบหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้</>
          ) : (
            <>Are you sure you want to delete <strong className="text-white">"{displayTitle}"</strong> ({movie.code})? This action cannot be undone.</>
          )}
        </p>

        <div className="flex items-center gap-3 p-3 bg-[#0F0F0F] rounded-xl mb-6 border border-white/5">
          <img
            src={movie.poster}
            alt={displayTitle}
            className="w-12 h-16 object-cover rounded-md"
          />
          <div>
            <div className="font-semibold text-white text-sm">{displayTitle}</div>
            <div className="text-xs text-gray-400">
              {language === 'th' ? `ปี ${movie.year}` : `Year ${movie.year}`} • {movie.category}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition flex items-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.deleteConfirm.confirm}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
