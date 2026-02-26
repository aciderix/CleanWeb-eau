import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
      return NextResponse.json(
        { error: 'Admin credentials not configured on server' },
        { status: 500 }
      );
    }

    if (username === adminUser && password === adminPass) {
      const token = createToken();
      return NextResponse.json({ token });
    }

    return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
}
