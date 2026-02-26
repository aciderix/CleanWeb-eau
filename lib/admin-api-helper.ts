import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyRequest } from '@/lib/admin-auth';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase config missing');
  return createClient(url, anonKey);
}

interface CrudConfig {
  listFn: string;
  createFn: string;
  updateFn: string;
  deleteFn: string;
  createParams: (body: any) => Record<string, any>;
  updateParams: (body: any) => Record<string, any>;
}

export function createCrudHandlers(config: CrudConfig) {
  async function GET(request: NextRequest) {
    if (!verifyRequest(request.headers.get('Authorization'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const supabase = getClient();
    const { data, error } = await supabase.rpc(config.listFn);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  async function POST(request: NextRequest) {
    if (!verifyRequest(request.headers.get('Authorization'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const supabase = getClient();
    const { data, error } = await supabase.rpc(config.createFn, config.createParams(body));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  async function PUT(request: NextRequest) {
    if (!verifyRequest(request.headers.get('Authorization'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const supabase = getClient();
    const { data, error } = await supabase.rpc(config.updateFn, config.updateParams(body));
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  async function DELETE(request: NextRequest) {
    if (!verifyRequest(request.headers.get('Authorization'))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let id: string | null = null;
    try {
      const body = await request.json();
      id = body.id;
    } catch {
      const url = new URL(request.url);
      id = url.searchParams.get('id');
    }
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const supabase = getClient();
    const { error } = await supabase.rpc(config.deleteFn, { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return { GET, POST, PUT, DELETE };
}
