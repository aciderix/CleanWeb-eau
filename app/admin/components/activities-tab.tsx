'use client';

import ListTab from './list-tab';
import type { FieldConfig } from './list-tab';

interface ActivitiesTabProps {
  token: string;
}

const ACTIVITY_FIELDS: FieldConfig[] = [
  { key: 'title', label: 'Titre', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
  { key: 'highlight', label: 'Mise en avant', type: 'text', placeholder: 'ex: Chaque week-end' },
  { key: 'image_url', label: 'URL de l\'image', type: 'text' },
  { key: 'image_alt', label: 'Texte alternatif image', type: 'text' },
  { key: 'link', label: 'Lien', type: 'text' },
  { key: 'link_text', label: 'Texte du lien', type: 'text', placeholder: 'ex: En savoir plus' },
  { key: 'sort_order', label: 'Ordre', type: 'number', defaultValue: 0 },
  { key: 'is_visible', label: 'Visible', type: 'boolean', defaultValue: true },
];

export default function ActivitiesTab({ token }: ActivitiesTabProps) {
  return (
    <ListTab
      token={token}
      apiEndpoint="/api/admin/activities"
      entityName="activité"
      entityNamePlural="activités"
      fields={ACTIVITY_FIELDS}
    />
  );
}
