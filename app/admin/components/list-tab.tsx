'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select';
  required?: boolean;
  defaultValue?: any;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface ListTabProps {
  token: string;
  apiEndpoint: string;
  entityName: string;
  entityNamePlural: string;
  fields: FieldConfig[];
}

export default function ListTab({
  token,
  apiEndpoint,
  entityName,
  entityNamePlural,
  fields,
}: ListTabProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) return;
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [token, apiEndpoint]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const getEmptyItem = () => {
    const item: any = {};
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) {
        item[f.key] = f.defaultValue;
      } else if (f.type === 'boolean') {
        item[f.key] = true;
      } else if (f.type === 'number') {
        item[f.key] = 0;
      } else {
        item[f.key] = '';
      }
    });
    return item;
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setSaving(true);
    setMessage('');

    try {
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(apiEndpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        setMessage(
          isNew
            ? `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} créé(e) !`
            : `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} mis(e) à jour !`
        );
        setEditingItem(null);
        fetchItems();
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
    if (!confirm(`Supprimer ce/cette ${entityName} ?`)) return;
    try {
      const res = await fetch(apiEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessage(`${entityName.charAt(0).toUpperCase() + entityName.slice(1)} supprimé(e)`);
        fetchItems();
      }
    } catch {
      setMessage('Erreur réseau');
    }
  };

  const handleToggleVisibility = async (item: any) => {
    try {
      await fetch(apiEndpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: item.id, is_visible: !item.is_visible }),
      });
      fetchItems();
    } catch {
      setMessage('Erreur réseau');
    }
  };

  const updateField = (key: string, value: any) => {
    setEditingItem({ ...editingItem, [key]: value });
  };

  const hasVisibility = fields.some((f) => f.key === 'is_visible');

  // Get the title field (first text field or 'title' or 'name')
  const titleField =
    fields.find((f) => f.key === 'title') ||
    fields.find((f) => f.key === 'name') ||
    fields.find((f) => f.type === 'text');

  const sortField = fields.find((f) => f.key === 'sort_order');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold capitalize">
          {entityNamePlural}
        </h2>
        <button
          onClick={() => {
            const empty = getEmptyItem();
            if (sortField) {
              empty.sort_order = items.length + 1;
            }
            setEditingItem(empty);
            setIsNew(true);
          }}
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-medium transition"
        >
          + Ajouter
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-lg bg-cyan-900/50 text-cyan-200 text-sm">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400">Aucun élément.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-gray-800 rounded-xl p-5 border transition ${
                hasVisibility
                  ? item.is_visible
                    ? 'border-gray-700'
                    : 'border-red-900/50 opacity-60'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {titleField ? item[titleField.key] : item.id}
                    </h3>
                    {hasVisibility && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          item.is_visible
                            ? 'bg-green-900 text-green-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {item.is_visible ? 'Visible' : 'Masqué'}
                      </span>
                    )}
                    {sortField && (
                      <span className="text-xs text-gray-500">
                        Ordre: {item.sort_order}
                      </span>
                    )}
                  </div>
                  {/* Show description or first textarea field value as preview */}
                  {fields
                    .filter(
                      (f) =>
                        f.type === 'textarea' &&
                        item[f.key]
                    )
                    .slice(0, 1)
                    .map((f) => (
                      <p key={f.key} className="text-gray-300 text-sm line-clamp-2">
                        {item[f.key]}
                      </p>
                    ))}
                  {/* Show other text fields as small details */}
                  {fields
                    .filter(
                      (f) =>
                        f.type === 'text' &&
                        f.key !== (titleField?.key || '') &&
                        f.key !== 'icon_name' &&
                        item[f.key]
                    )
                    .slice(0, 3)
                    .map((f) => (
                      <p key={f.key} className="text-gray-400 text-xs mt-1">
                        {f.label}: {item[f.key]}
                      </p>
                    ))}
                  {/* Show icon if present */}
                  {item.icon_name && (
                    <p className="text-gray-400 text-xs mt-1">🎨 Icône: {item.icon_name}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {hasVisibility && (
                    <button
                      onClick={() => handleToggleVisibility(item)}
                      className="text-sm px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                      title={item.is_visible ? 'Masquer' : 'Rendre visible'}
                    >
                      {item.is_visible ? '👁️' : '👁️‍🗨️'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingItem({ ...item });
                      setIsNew(false);
                    }}
                    className="text-sm px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 transition"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isNew
                ? `➕ Nouveau/Nouvelle ${entityName}`
                : `✏️ Modifier ${entityName}`}
            </h2>
            <div className="space-y-4">
              {fields.map((field) => {
                if (field.type === 'boolean') {
                  return (
                    <div key={field.key} className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingItem[field.key] ?? field.defaultValue ?? true}
                          onChange={(e) => updateField(field.key, e.target.checked)}
                          className="w-5 h-5 rounded"
                        />
                        <span className="text-sm text-gray-300">{field.label}</span>
                      </label>
                    </div>
                  );
                }

                if (field.type === 'textarea') {
                  return (
                    <div key={field.key}>
                      <label className="block text-sm text-gray-300 mb-1">
                        {field.label} {field.required && '*'}
                      </label>
                      <textarea
                        value={editingItem[field.key] || ''}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        rows={3}
                        placeholder={field.placeholder}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  );
                }

                if (field.type === 'select') {
                  return (
                    <div key={field.key}>
                      <label className="block text-sm text-gray-300 mb-1">
                        {field.label} {field.required && '*'}
                      </label>
                      <select
                        value={editingItem[field.key] || ''}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">-- Sélectionner --</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.type === 'number') {
                  return (
                    <div key={field.key}>
                      <label className="block text-sm text-gray-300 mb-1">
                        {field.label} {field.required && '*'}
                      </label>
                      <input
                        type="number"
                        value={editingItem[field.key] ?? field.defaultValue ?? 0}
                        onChange={(e) => updateField(field.key, parseInt(e.target.value) || 0)}
                        placeholder={field.placeholder}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  );
                }

                // text
                return (
                  <div key={field.key}>
                    <label className="block text-sm text-gray-300 mb-1">
                      {field.label} {field.required && '*'}
                    </label>
                    <input
                      type="text"
                      value={editingItem[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingItem(null)}
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
