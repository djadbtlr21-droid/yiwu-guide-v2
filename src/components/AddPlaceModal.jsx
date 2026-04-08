import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { T } from '../translations';
import { CATEGORIES } from '../data/places';

const EMPTY_FORM = {
  name: '',
  nameZh: '',
  nameEn: '',
  category: '식당',
  subcategory: '전체',
  address: '',
  phone: '',
  wechat: '',
  hours: '',
  price: '',
  description: '',
  rating: 0,
};

function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(value === star ? 0 : star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform active:scale-90"
        >
          <Star
            size={28}
            className={`transition-colors ${display >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        </button>
      ))}
      <span className="ml-1 text-sm text-gray-400">
        {value > 0 ? value.toFixed(1) : '−'}
      </span>
    </div>
  );
}

export default function AddPlaceModal({ editingPlace, onClose }) {
  const { lang, addCustomPlace, updateCustomPlace, tab } = useApp();
  const t = T[lang];

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (editingPlace) {
      setForm({
        name: editingPlace.name || '',
        nameZh: editingPlace.nameZh || '',
        nameEn: editingPlace.nameEn || '',
        category: editingPlace.category || '식당',
        subcategory: editingPlace.subcategory || '전체',
        address: editingPlace.address || '',
        phone: editingPlace.phone || '',
        wechat: editingPlace.wechat || '',
        hours: editingPlace.hours || '',
        price: editingPlace.price || '',
        description: editingPlace.description || '',
        rating: editingPlace.rating || 0,
      });
    } else {
      // tab is now a Korean string ('식당', etc.)
      setForm({ ...EMPTY_FORM, category: tab, subcategory: '전체' });
    }
  }, [editingPlace, tab]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError(lang === 'ko' ? '업체명(한글)은 필수입니다' : 'Name is required');
      return;
    }
    const data = {
      name: form.name.trim(),
      nameZh: form.nameZh.trim(),
      nameEn: form.nameEn.trim(),
      category: form.category,
      subcategory: form.subcategory === '전체' ? null : form.subcategory,
      address: form.address.trim(),
      phone: form.phone.trim(),
      wechat: form.wechat.trim(),
      hours: form.hours.trim(),
      price: form.price.trim(),
      description: form.description.trim(),
      rating: form.rating,
    };
    if (editingPlace) {
      updateCustomPlace(editingPlace.id, data);
    } else {
      addCustomPlace(data);
    }
    onClose();
  };

  const catLabels = { '식당': t.restaurant, '마사지': t.massage, '당구': t.billiards, '쇼핑몰': t.shopping, '집': t.home };
  const subLabels = { '전체': t.other, '한식': t.korean, '중식': t.chinese };

  const inputClass =
    'w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-base outline-none focus:border-orange-400 dark:focus:border-orange-400 transition-colors placeholder-gray-400';
  const labelClass = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1';
  const selectClass =
    'w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-base outline-none focus:border-orange-400 transition-colors';

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div className="w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {editingPlace ? t.editPlaceTitle : t.addPlaceTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form body (scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Name (Korean) - required */}
          <div>
            <label className={labelClass}>
              {t.nameKo} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => { set('name', e.target.value); setError(''); }}
              placeholder={t.nameKoPlaceholder}
              className={inputClass}
              autoFocus
            />
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>

          {/* Name (Chinese) */}
          <div>
            <label className={labelClass}>{t.nameZh}</label>
            <input
              type="text"
              value={form.nameZh}
              onChange={e => set('nameZh', e.target.value)}
              placeholder="中文名称"
              className={inputClass}
            />
          </div>

          {/* Name (English) */}
          <div>
            <label className={labelClass}>{t.nameEn}</label>
            <input
              type="text"
              value={form.nameEn}
              onChange={e => set('nameEn', e.target.value)}
              placeholder="English name"
              className={inputClass}
            />
          </div>

          {/* Category + Subcategory row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>{t.category}</label>
              <select
                value={form.category}
                onChange={e => { set('category', e.target.value); set('subcategory', 'all'); }}
                className={selectClass}
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{catLabels[c.id]}</option>
                ))}
              </select>
            </div>

            {form.category === '식당' && (
              <div className="flex-1">
                <label className={labelClass}>{t.subcategory}</label>
                <select
                  value={form.subcategory}
                  onChange={e => set('subcategory', e.target.value)}
                  className={selectClass}
                >
                  <option value="전체">{t.other}</option>
                  <option value="한식">{t.korean}</option>
                  <option value="중식">{t.chinese}</option>
                </select>
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className={labelClass}>{t.ratingLabel}</label>
            <StarInput value={form.rating} onChange={v => set('rating', v)} />
          </div>

          {/* Address */}
          <div>
            <label className={labelClass}>{t.address}</label>
            <input
              type="text"
              value={form.address}
              onChange={e => set('address', e.target.value)}
              placeholder={t.addressPlaceholder}
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>{t.phone}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder={t.phonePlaceholder}
              className={inputClass}
            />
          </div>

          {/* WeChat */}
          <div>
            <label className={labelClass}>{t.wechat}</label>
            <input
              type="text"
              value={form.wechat}
              onChange={e => set('wechat', e.target.value)}
              placeholder={t.wechatPlaceholder}
              className={inputClass}
            />
          </div>

          {/* Hours */}
          <div>
            <label className={labelClass}>{t.hours}</label>
            <input
              type="text"
              value={form.hours}
              onChange={e => set('hours', e.target.value)}
              placeholder={t.hoursPlaceholder}
              className={inputClass}
            />
          </div>

          {/* Price */}
          <div>
            <label className={labelClass}>{t.price}</label>
            <input
              type="text"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder={t.pricePlaceholder}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>{t.description}</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder={t.descPlaceholder}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Bottom padding so last field isn't hidden behind sticky footer */}
          <div className="h-2" />
        </form>

        {/* Footer buttons (sticky) */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            form="add-place-form"
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-sm"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
