'use client';

import { useState, useEffect } from 'react';
import EventsTab from './components/events-tab';
import ContentTab from './components/content-tab';
import ListTab from './components/list-tab';
import ActivitiesTab from './components/activities-tab';
import PartnersTab from './components/partners-tab';

const TABS = [
  { id: 'events', label: '📅 Événements' },
  { id: 'content', label: '🏠 Contenu du site' },
  { id: 'missions', label: '🎯 Missions' },
  { id: 'activities', label: '🚣 Activités' },
  { id: 'approaches', label: '🔧 Approche' },
  { id: 'areas', label: '🗺️ Zones' },
  { id: 'partners', label: '🤝 Partenaires' },
];

const MISSION_FIELDS = [
  { key: 'title', label: 'Titre', type: 'text' as const, required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
  {
    key: 'icon_name',
    label: 'Icône (Lucide)',
    type: 'text' as const,
    defaultValue: 'Star',
    placeholder: 'Waves, Sprout, Users...',
  },
  { key: 'sort_order', label: 'Ordre', type: 'number' as const, defaultValue: 0 },
  { key: 'is_visible', label: 'Visible', type: 'boolean' as const, defaultValue: true },
];

const APPROACH_FIELDS = [
  { key: 'title', label: 'Titre', type: 'text' as const, required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
  {
    key: 'icon_name',
    label: 'Icône (Lucide)',
    type: 'text' as const,
    defaultValue: 'Star',
    placeholder: 'Recycle, Users, Lightbulb...',
  },
  { key: 'sort_order', label: 'Ordre', type: 'number' as const, defaultValue: 0 },
  { key: 'is_visible', label: 'Visible', type: 'boolean' as const, defaultValue: true },
];

const AREA_FIELDS = [
  { key: 'title', label: 'Nom de la zone', type: 'text' as const, required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const },
  { key: 'sort_order', label: 'Ordre', type: 'number' as const, defaultValue: 0 },
  { key: 'is_visible', label: 'Visible', type: 'boolean' as const, defaultValue: true },
];

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token');
    if (saved) setToken(saved);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        sessionStorage.setItem('admin_token', data.token);
      } else {
        setLoginError(data.error || 'Erreur de connexion');
      }
    } catch {
      setLoginError('Erreur réseau');
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('admin_token');
  };

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">🔒 Admin</h1>
            <p className="text-gray-400 mt-2">Clean&apos;Eau Nantes — Gestion du site</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Identifiant</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'events':
        return <EventsTab token={token} />;
      case 'content':
        return <ContentTab token={token} />;
      case 'missions':
        return (
          <ListTab
            token={token}
            apiEndpoint="/api/admin/missions"
            entityName="mission"
            entityNamePlural="missions"
            fields={MISSION_FIELDS}
          />
        );
      case 'activities':
        return <ActivitiesTab token={token} />;
      case 'approaches':
        return (
          <ListTab
            token={token}
            apiEndpoint="/api/admin/approaches"
            entityName="approche"
            entityNamePlural="approches"
            fields={APPROACH_FIELDS}
          />
        );
      case 'areas':
        return (
          <ListTab
            token={token}
            apiEndpoint="/api/admin/areas"
            entityName="zone"
            entityNamePlural="zones"
            fields={AREA_FIELDS}
          />
        );
      case 'partners':
        return <PartnersTab token={token} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🌊 Clean&apos;Eau Admin</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg transition"
        >
          Déconnexion
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Tab navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        {renderActiveTab()}
      </main>
    </div>
  );
}
