import { createCrudHandlers } from '@/lib/admin-api-helper';

const { GET, POST, PUT, DELETE } = createCrudHandlers({
  listFn: 'admin_list_partners',
  createFn: 'admin_create_partner',
  updateFn: 'admin_update_partner',
  deleteFn: 'admin_delete_partner',
  createParams: (body) => ({
    p_name: body.name,
    p_logo_url: body.logo_url || '',
    p_website_url: body.website_url || '',
    p_sort_order: body.sort_order || 0,
    p_is_visible: body.is_visible ?? true,
  }),
  updateParams: (body) => ({
    p_id: body.id,
    p_name: body.name,
    p_logo_url: body.logo_url,
    p_website_url: body.website_url,
    p_sort_order: body.sort_order,
    p_is_visible: body.is_visible,
  }),
});

export { GET, POST, PUT, DELETE };
