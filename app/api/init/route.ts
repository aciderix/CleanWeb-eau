import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"

export function GET() {
  return NextResponse.json({ ok: true }, { status: 200 })
}

export async function POST(req: NextRequest) {
  // Skip authentication check for initial setup

  try {
    await connectDB()

    // Check if admin user already exists
    const adminExists = await User.findOne({ role: "admin" })

    if (adminExists) {
      return NextResponse.json({ message: "Admin user already exists" }, { status: 400 })
    }

    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ message: "Please provide username and password" }, { status: 400 })
    }

    // Create admin user
    const admin = await User.create({
      username,
      password,
      role: "admin",
    })

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        user: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

