import React, { useState } from 'react';
import { FolderOpen, Plus, Pencil, Trash2, Tag, Layers, Check, X } from 'lucide-react';
import { Category, Genre } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoriesManagementProps {
  categories: Category[];
  genres: Genre[];
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateGenres: (genres: Genre[]) => void;
}

export const CategoriesManagement: React.FC<CategoriesManagementProps> = ({
  categories,
  genres,
  onUpdateCategories,
  onUpdateGenres,
}) => {
  const { t, language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'categories' | 'genres'>('categories');
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [newGenName, setNewGenName] = useState('');
  const [newGenColor, setNewGenColor] = useState('#E50914');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatSlug.trim() || newCatName.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
      description: newCatDesc.trim() || undefined,
    };
    onUpdateCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
  };

  const handleDeleteCategory = (id: string) => {
    onUpdateCategories(categories.filter((c) => c.id !== id));
  };

  const handleAddGenre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGenName.trim()) return;
    const newGen: Genre = {
      id: `gen-${Date.now()}`,
      name: newGenName.trim(),
      slug: newGenName.toLowerCase().replace(/\s+/g, '-'),
      color: newGenColor,
    };
    onUpdateGenres([...genres, newGen]);
    setNewGenName('');
  };

  const handleDeleteGenre = (id: string) => {
    onUpdateGenres(genres.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FolderOpen className="w-6 h-6 text-[#E50914]" />
            {t.categories.pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            {t.categories.pageSubtitle}
          </p>
        </div>

        <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-white/5 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'categories'
                ? 'bg-[#E50914] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.categories.tabCategories} ({categories.length})
          </button>
          <button
            onClick={() => setActiveSubTab('genres')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'genres'
                ? 'bg-[#E50914] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.categories.tabGenres} ({genres.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'categories' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Category Form */}
          <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 h-fit shadow-md">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#28A745]" />
              {t.categories.addCategoryBtn}
            </h2>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {t.categories.categoryName} *
                </label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder={language === 'th' ? 'กรอกชื่อหมวดหมู่' : 'e.g. Action Movies'}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {t.categories.slug}
                </label>
                <input
                  type="text"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  placeholder={language === 'th' ? 'เช่น thai-movies, action' : 'e.g. thai-movies, action'}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">{language === 'th' ? 'คำอธิบาย' : 'Description'}</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder={language === 'th' ? 'คำอธิบายสั้นๆ...' : 'Short description...'}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#28A745]/20"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'th' ? 'บันทึกหมวดหมู่' : 'Save Category'}</span>
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2 bg-[#1A1A1A] rounded-xl p-5 border border-white/5 shadow-md">
            <h2 className="text-base font-bold text-white mb-4">
              {language === 'th' ? 'รายการหมวดหมู่ทั้งหมด' : 'All Categories List'}
            </h2>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3.5 bg-[#0F0F0F] rounded-xl border border-white/5 hover:border-white/10 transition"
                >
                  <div>
                    <div className="font-semibold text-sm text-white flex items-center gap-2">
                      <span>{cat.name}</span>
                      <span className="font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded text-gray-400">
                        /{cat.slug}
                      </span>
                    </div>
                    {cat.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-[#E50914]/20 text-[#E50914] px-2.5 py-1 rounded-full font-semibold">
                      {cat.count} {t.common.items}
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Genres Sub-Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1A] rounded-xl p-5 border border-white/5 h-fit shadow-md">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#E50914]" />
              {t.categories.addGenreBtn}
            </h2>

            <form onSubmit={handleAddGenre} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {t.categories.genreName} *
                </label>
                <input
                  type="text"
                  value={newGenName}
                  onChange={(e) => setNewGenName(e.target.value)}
                  placeholder={language === 'th' ? 'กรอกชื่อแนวหนัง (เช่น ไซไฟ, คอมเมดี้)' : 'Genre name (e.g. Sci-Fi, Comedy)'}
                  className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#E50914]"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 font-medium mb-1">
                  {t.categories.genreColor}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newGenColor}
                    onChange={(e) => setNewGenColor(e.target.value)}
                    className="w-9 h-9 bg-transparent border-0 rounded cursor-pointer"
                  />
                  <span className="font-mono text-xs text-gray-300">{newGenColor}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#28A745] hover:bg-[#28A745]/90 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'th' ? 'เพิ่มแนวภาพยนตร์' : 'Add Genre'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-[#1A1A1A] rounded-xl p-5 border border-white/5 shadow-md">
            <h2 className="text-base font-bold text-white mb-4">
              {language === 'th' ? 'แท็กประเภทภาพยนตร์ทั้งหมด' : 'All Movie Genres Tags'}
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {genres.map((gen) => (
                <div
                  key={gen.id}
                  className="flex items-center gap-2 px-3 py-2 bg-[#0F0F0F] rounded-xl border border-white/10 text-xs text-white"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: gen.color }}
                  />
                  <span className="font-medium">{gen.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">({gen.slug})</span>
                  <button
                    onClick={() => handleDeleteGenre(gen.id)}
                    className="text-gray-500 hover:text-red-400 ml-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
