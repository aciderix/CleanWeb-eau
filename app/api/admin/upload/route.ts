import { NextRequest, NextResponse } from "next/server";

// Validate admin token (same pattern as other admin routes)
function validateToken(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);

  const secret = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || "";
  const crypto = require("crypto");
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return false;
    const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (signature !== expectedSig) return false;
    const data = JSON.parse(Buffer.from(payload, "base64").toString());
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

// POST: Upload image
export async function POST(request: NextRequest) {
  if (!validateToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Generate unique filename to avoid conflicts
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/images/${filename}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": file.type,
      },
      body: buffer,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error: `Upload failed: ${error}` }, { status: 500 });
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/images/${filename}`;
  return NextResponse.json({ url: publicUrl, filename });
}

// DELETE: Delete image
export async function DELETE(request: NextRequest) {
  if (!validateToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await request.json();
  if (!filename) {
    return NextResponse.json({ error: "No filename provided" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/images/${filename}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error: `Delete failed: ${error}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
