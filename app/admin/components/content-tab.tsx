'use client';

import { useState, useEffect, useCallback } from 'react';

interface ContentTabProps {
  token: string;
}

const SECTIONS = [
  { key: 'hero', label: '🏠 Hero' },
  { key: 'about', label: '📖 À propos' },
  { key: 'support', label: '💝 Soutenir' },
  { key: 'contact', label: '📧 Contact' },
  { key: 'footer', label: '📋 Footer' },
];

export default function ContentTab({ token }: ContentTabProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [allContent, setAllContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return;
      const data = await res.json();
      // data is an array of { section_key, content }
      const map: Record<string, any> = {};
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          map[item.section_key] = item.content || {};
        });
      }
      setAllContent(map);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateContent = (sectionKey: string, fieldKey: string, value: any) => {
    setAllContent((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [fieldKey]: value,
      },
    }));
  };

  const updateArrayItem = (
    sectionKey: string,
    fieldKey: string,
    index: number,
    value: string
  ) => {
    const arr = [...(allContent[sectionKey]?.[fieldKey] || [])];
    arr[index] = value;
    updateContent(sectionKey, fieldKey, arr);
  };

  const addArrayItem = (sectionKey: string, fieldKey: string) => {
    const arr = [...(allContent[sectionKey]?.[fieldKey] || []), ''];
    updateContent(sectionKey, fieldKey, arr);
  };

  const removeArrayItem = (sectionKey: string, fieldKey: string, index: number) => {
    const arr = [...(allContent[sectionKey]?.[fieldKey] || [])];
    arr.splice(index, 1);
    updateContent(sectionKey, fieldKey, arr);
  };

  const handleSave = async (sectionKey: string) => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section_key: sectionKey,
          content: allContent[sectionKey] || {},
        }),
      });
      if (res.ok) {
        setMessage(`Section "${sectionKey}" sauvegardée !`);
      } else {
        const data = await res.json();
        setMessage(`Erreur : ${data.error}`);
      }
    } catch {
      setMessage('Erreur réseau');
    }
    setSaving(false);
  };

  const getVal = (section: string, key: string, fallback: any = '') => {
    return allContent[section]?.[key] ?? fallback;
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionKey: string, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        const data = await res.json();
        updateContent(sectionKey, fieldKey, data.url);
      }
    } catch {}
    setUploading(false);
  };

  const renderImageInput = (
    sectionKey: string,
    fieldKey: string,
    label: string
  ) => (
    <div key={fieldKey}>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      {getVal(sectionKey, fieldKey) && (
        <div className="mb-2">
          <img src={getVal(sectionKey, fieldKey)} alt="Aperçu" className="h-24 object-contain rounded-lg bg-gray-700 p-1" />
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={getVal(sectionKey, fieldKey)}
          onChange={(e) => updateContent(sectionKey, fieldKey, e.target.value)}
          className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
        />
        <label className="bg-cyan-700 hover:bg-cyan-600 px-4 py-2.5 rounded-lg cursor-pointer transition text-sm whitespace-nowrap">
          {uploading ? '⏳...' : '📤 Upload'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleContentImageUpload(e, sectionKey, fieldKey)}
          />
        </label>
      </div>
    </div>
  );

  const renderTextInput = (
    sectionKey: string,
    fieldKey: string,
    label: string,
    placeholder?: string
  ) => (
    <div key={fieldKey}>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <input
        type="text"
        value={getVal(sectionKey, fieldKey)}
        onChange={(e) => updateContent(sectionKey, fieldKey, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );

  const renderTextarea = (
    sectionKey: string,
    fieldKey: string,
    label: string,
    rows = 3
  ) => (
    <div key={fieldKey}>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <textarea
        value={getVal(sectionKey, fieldKey)}
        onChange={(e) => updateContent(sectionKey, fieldKey, e.target.value)}
        rows={rows}
        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    </div>
  );

  const renderArrayField = (
    sectionKey: string,
    fieldKey: string,
    label: string,
    inputType: 'text' | 'textarea' = 'text'
  ) => {
    const arr: string[] = getVal(sectionKey, fieldKey, []);
    return (
      <div key={fieldKey}>
        <label className="block text-sm text-gray-300 mb-1">{label}</label>
        <div className="space-y-2">
          {arr.map((item: string, i: number) => (
            <div key={i} className="flex gap-2">
              {inputType === 'textarea' ? (
                <textarea
                  value={item}
                  onChange={(e) => updateArrayItem(sectionKey, fieldKey, i, e.target.value)}
                  rows={2}
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayItem(sectionKey, fieldKey, i, e.target.value)}
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              )}
              <button
                onClick={() => removeArrayItem(sectionKey, fieldKey, i)}
                className="px-3 py-1 rounded-lg bg-red-700 hover:bg-red-600 text-white text-sm transition"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem(sectionKey, fieldKey)}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition"
          >
            + Ajouter un élément
          </button>
        </div>
      </div>
    );
  };

  const renderSaveButton = (sectionKey: string) => (
    <div className="flex justify-end mt-6">
      <button
        onClick={() => handleSave(sectionKey)}
        disabled={saving}
        className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition font-medium disabled:opacity-50"
      >
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  );

  const renderHeroSection = () => (
    <div className="space-y-4">
      {renderTextInput('hero', 'title', 'Titre')}
      {renderTextInput('hero', 'subtitle', 'Sous-titre')}
      {renderImageInput('hero', 'background_image_url', 'Image de fond')}
      <div className="grid grid-cols-2 gap-4">
        {renderTextInput('hero', 'cta_primary_text', 'Bouton principal — Texte')}
        {renderTextInput('hero', 'cta_primary_link', 'Bouton principal — Lien')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderTextInput('hero', 'cta_secondary_text', 'Bouton secondaire — Texte')}
        {renderTextInput('hero', 'cta_secondary_link', 'Bouton secondaire — Lien')}
      </div>
      {renderSaveButton('hero')}
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-4">
      {renderTextInput('about', 'section_title', 'Titre de la section')}
      {renderArrayField('about', 'paragraphs', 'Paragraphes', 'textarea')}
      {renderImageInput('about', 'image_url', 'Image')}
      {renderTextInput('about', 'image_alt', 'Texte alternatif de l\'image')}
      {renderSaveButton('about')}
    </div>
  );

  const renderSupportSection = () => (
    <div className="space-y-4">
      {renderTextInput('support', 'section_title', 'Titre de la section')}
      {renderTextarea('support', 'intro_text', 'Texte d\'introduction')}
      {renderTextInput('support', 'why_title', 'Titre "Pourquoi"')}
      {renderTextarea('support', 'why_text', 'Texte "Pourquoi"')}
      {renderTextInput('support', 'how_title', 'Titre "Comment"')}
      {renderArrayField('support', 'how_items', 'Éléments "Comment"', 'text')}
      <div className="grid grid-cols-2 gap-4">
        {renderTextInput('support', 'donation_text', 'Texte du bouton don')}
        {renderTextInput('support', 'donation_link', 'Lien du don')}
      </div>
      {renderImageInput('support', 'logo_url', 'Logo')}
      {renderSaveButton('support')}
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-4">
      {renderTextInput('contact', 'section_title', 'Titre de la section')}
      {renderTextInput('contact', 'phone', 'Téléphone')}
      {renderTextInput('contact', 'email', 'Email')}
      {renderTextInput('contact', 'address', 'Adresse')}
      {renderTextInput('contact', 'instagram_url', 'URL Instagram')}
      {renderTextInput('contact', 'formspree_endpoint', 'Endpoint Formspree')}
      {renderSaveButton('contact')}
    </div>
  );

  const renderFooterSection = () => (
    <div className="space-y-4">
      {renderTextarea('footer', 'description', 'Description')}
      {renderTextInput('footer', 'email', 'Email')}
      {renderTextInput('footer', 'phone', 'Téléphone')}
      {renderTextInput('footer', 'address', 'Adresse')}
      {renderTextInput('footer', 'copyright_text', 'Texte copyright')}
      {renderSaveButton('footer')}
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroSection();
      case 'about':
        return renderAboutSection();
      case 'support':
        return renderSupportSection();
      case 'contact':
        return renderContactSection();
      case 'footer':
        return renderFooterSection();
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏠 Contenu du site</h2>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-cyan-900/50 text-cyan-200 text-sm">
          {message}
        </div>
      )}

      {/* Section sub-tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            onClick={() => {
              setActiveSection(section.key);
              setMessage('');
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeSection === section.key
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          {renderActiveSection()}
        </div>
      )}
    </div>
  );
}
