import { createCrudHandlers } from '@/lib/admin-api-helper';

const { GET, POST, PUT, DELETE } = createCrudHandlers({
  listFn: 'admin_list_missions',
  createFn: 'admin_create_mission',
  updateFn: 'admin_update_mission',
  deleteFn: 'admin_delete_mission',
  createParams: (body) => ({
    p_title: body.title,
    p_description: body.description,
    p_icon_name: body.icon_name || 'Star',
    p_sort_order: body.sort_order || 0,
    p_is_visible: body.is_visible ?? true,
  }),
  updateParams: (body) => ({
    p_id: body.id,
    p_title: body.title,
    p_description: body.description,
    p_icon_name: body.icon_name,
    p_sort_order: body.sort_order,
    p_is_visible: body.is_visible,
  }),
});

export { GET, POST, PUT, DELETE };
