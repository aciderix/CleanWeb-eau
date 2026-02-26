'use client';

import ListTab from './list-tab';
import type { FieldConfig } from './list-tab';

interface PartnersTabProps {
  token: string;
}

const PARTNER_FIELDS: FieldConfig[] = [
  { key: 'name', label: 'Nom', type: 'text', required: true },
  { key: 'logo_url', label: 'URL du logo', type: 'text' },
  { key: 'website_url', label: 'URL du site web', type: 'text' },
  { key: 'sort_order', label: 'Ordre', type: 'number', defaultValue: 0 },
  { key: 'is_visible', label: 'Visible', type: 'boolean', defaultValue: true },
];

export default function PartnersTab({ token }: PartnersTabProps) {
  return (
    <ListTab
      token={token}
      apiEndpoint="/api/admin/partners"
      entityName="partenaire"
      entityNamePlural="partenaires"
      fields={PARTNER_FIELDS}
    />
  );
}
