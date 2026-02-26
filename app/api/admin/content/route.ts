import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyRequest } from '@/lib/admin-auth';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase config missing');
  return createClient(url, anonKey);
}

// GET - List all site content sections
export async function GET(request: NextRequest) {
  if (!verifyRequest(request.headers.get('Authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getClient();
  const { data, error } = await supabase.rpc('admin_list_site_content');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PUT - Update a section's content
export async function PUT(request: NextRequest) {
  if (!verifyRequest(request.headers.get('Authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  if (!body.section_key || !body.content) {
    return NextResponse.json({ error: 'Missing section_key or content' }, { status: 400 });
  }
  const supabase = getClient();
  const { error } = await supabase.rpc('admin_update_site_content', {
    p_section_key: body.section_key,
    p_content: body.content,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
