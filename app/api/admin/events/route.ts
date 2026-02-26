import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyRequest } from '@/lib/admin-auth';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase config missing');
  return createClient(url, anonKey);
}

// GET - List ALL events (including hidden) via RPC
export async function GET(request: NextRequest) {
  if (!verifyRequest(request.headers.get('Authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getClient();
  const { data, error } = await supabase.rpc('admin_list_events');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - Create event via RPC
export async function POST(request: NextRequest) {
  if (!verifyRequest(request.headers.get('Authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getClient();
  const { data, error } = await supabase.rpc('admin_create_event', {
    p_title: body.title,
    p_description: body.description,
    p_date: body.date,
    p_location: body.location,
    p_link: body.link || '',
    p_link_text: body.link_text || '',
    p_sort_order: body.sort_order || 0,
    p_is_visible: body.is_visible ?? true,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PUT - Update event via RPC
export async function PUT(request: NextRequest) {
  if (!verifyRequest(request.headers.get('Authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'Missing event id' }, { status: 400 });

  const supabase = getClient();
  const { data, error } = await supabase.rpc('admin_update_event', {
    p_id: body.id,
    p_title: body.title ?? null,
    p_description: body.description ?? null,
    p_date: body.date ?? null,
    p_location: body.location ?? null,
    p_link: body.link ?? null,
    p_link_text: body.link_text ?? null,
    p_sort_order: body.sort_order ?? null,
    p_is_visible: body.is_visible ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - Delete event via RPC
export async function DELETE(request: NextRequest) {
  if (!verifyRequest(request.headers.get('Authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let id: string | null = null;

  // Support both body JSON and query param
  try {
    const body = await request.json();
    id = body.id;
  } catch {
    const url = new URL(request.url);
    id = url.searchParams.get('id');
  }

  if (!id) return NextResponse.json({ error: 'Missing event id' }, { status: 400 });

  const supabase = getClient();
  const { error } = await supabase.rpc('admin_delete_event', { p_id: id });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
