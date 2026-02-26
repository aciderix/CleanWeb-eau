import { NextRequest, NextResponse } from "next/server";
import { verifyRequest } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase config missing");
  return createClient(url, anonKey);
}

// POST: Upload image
export async function POST(request: NextRequest) {
  if (!verifyRequest(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate unique filename to avoid conflicts
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${safeName}`;

    const supabase = getClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/images/${filename}`;
    return NextResponse.json({ url: publicUrl, filename });
  } catch (err: any) {
    return NextResponse.json({ error: `Upload error: ${err.message}` }, { status: 500 });
  }
}

// DELETE: Delete image
export async function DELETE(request: NextRequest) {
  if (!verifyRequest(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: "No filename provided" }, { status: 400 });
    }

    const supabase = getClient();
    const { error } = await supabase.storage
      .from("images")
      .remove([filename]);

    if (error) {
      return NextResponse.json({ error: `Delete failed: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: `Delete error: ${err.message}` }, { status: 500 });
  }
}
