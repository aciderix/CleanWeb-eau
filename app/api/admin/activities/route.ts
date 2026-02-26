import { createCrudHandlers } from '@/lib/admin-api-helper';

const { GET, POST, PUT, DELETE } = createCrudHandlers({
  listFn: 'admin_list_activities',
  createFn: 'admin_create_activity',
  updateFn: 'admin_update_activity',
  deleteFn: 'admin_delete_activity',
  createParams: (body) => ({
    p_title: body.title,
    p_description: body.description,
    p_highlight: body.highlight || '',
    p_image_url: body.image_url || '',
    p_image_alt: body.image_alt || '',
    p_link: body.link || '',
    p_link_text: body.link_text || '',
    p_sort_order: body.sort_order || 0,
    p_is_visible: body.is_visible ?? true,
  }),
  updateParams: (body) => ({
    p_id: body.id,
    p_title: body.title,
    p_description: body.description,
    p_highlight: body.highlight,
    p_image_url: body.image_url,
    p_image_alt: body.image_alt,
    p_link: body.link,
    p_link_text: body.link_text,
    p_sort_order: body.sort_order,
    p_is_visible: body.is_visible,
  }),
});

export { GET, POST, PUT, DELETE };
