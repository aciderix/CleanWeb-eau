'use client';

import { useState, useEffect, useCallback } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  link: string;
  link_text: string;
  sort_order: number;
  is_visible: boolean;
}

const emptyEvent: Omit<Event, 'id'> = {
  title: '',
  description: '',
  date: '',
  location: '',
  link: '',
  link_text: '',
  sort_order: 0,
  is_visible: true,
};

interface EventsTabProps {
  token: string;
}

export default function EventsTab({ token }: EventsTabProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return;
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSave = async () => {
    if (!editingEvent) return;
    setSaving(true);
    setMessage('');

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/events', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingEvent),
      });

      if (res.ok) {
        setMessage(isNew ? 'Événement créé !' : 'Événement mis à jour !');
        setEditingEvent(null);
        fetchEvents();
      } else {
        const data = await res.json();
        setMessage(`Erreur : ${data.error}`);
      }
    } catch {
      setMessage('Erreur réseau');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    try {
      const res = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessage('Événement supprimé');
        fetchEvents();
      }
    } catch {
      setMessage('Erreur réseau');
    }
  };

  const handleToggleVisibility = async (event: Event) => {
    try {
      await fetch('/api/admin/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: event.id, is_visible: !event.is_visible }),
      });
      fetchEvents();
    } catch {
      setMessage('Erreur réseau');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📅 Événements</h2>
        <button
          onClick={() => {
            setEditingEvent({ ...emptyEvent, sort_order: events.length + 1 });
            setIsNew(true);
          }}
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-medium transition"
        >
          + Nouvel événement
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-cyan-900/50 text-cyan-200 text-sm">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-400">Aucun événement.</p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className={`bg-gray-800 rounded-xl p-5 border transition ${
                event.is_visible ? 'border-gray-700' : 'border-red-900/50 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        event.is_visible
                          ? 'bg-green-900 text-green-300'
                          : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {event.is_visible ? 'Visible' : 'Masqué'}
                    </span>
                    <span className="text-xs text-gray-500">Ordre: {event.sort_order}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">
                    📅 {event.date} — 📍 {event.location}
                  </p>
                  <p className="text-gray-300 text-sm">{event.description}</p>
                  {event.link && (
                    <p className="text-cyan-400 text-sm mt-1">
                      🔗 {event.link_text}: {event.link}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleToggleVisibility(event)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                    title={event.is_visible ? 'Masquer' : 'Rendre visible'}
                  >
                    {event.is_visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingEvent({ ...event });
                      setIsNew(false);
                    }}
                    className="text-sm px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 transition"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isNew ? '➕ Nouvel événement' : '✏️ Modifier l\'événement'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Titre *</label>
                <input
                  type="text"
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Description *</label>
                <textarea
                  value={editingEvent.description || ''}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    placeholder="ex: Dimanche 27 juillet"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Lieu</label>
                  <input
                    type="text"
                    value={editingEvent.location || ''}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, location: e.target.value })
                    }
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Lien</label>
                  <input
                    type="url"
                    value={editingEvent.link || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, link: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Texte du lien</label>
                  <input
                    type="text"
                    value={editingEvent.link_text || ''}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, link_text: e.target.value })
                    }
                    placeholder="ex: S'inscrire"
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Ordre d&apos;affichage</label>
                  <input
                    type="number"
                    value={editingEvent.sort_order || 0}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        sort_order: parseInt(e.target.value),
                      })
                    }
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingEvent.is_visible ?? true}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, is_visible: e.target.checked })
                      }
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm text-gray-300">Visible sur le site</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-5 py-2.5 rounded-lg bg-gray-600 hover:bg-gray-500 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 transition font-medium disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : isNew ? 'Créer' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
