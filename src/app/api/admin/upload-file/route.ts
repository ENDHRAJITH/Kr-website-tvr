import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Clean filename
    const origName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const timeStamp = Date.now()
    const fileName = `${timeStamp}_${origName}`
    const filePath = path.join(uploadsDir, fileName)

    await writeFile(filePath, buffer)

    const publicUrl = `/uploads/${fileName}`
    return NextResponse.json({ url: publicUrl, success: true })
  } catch (error: any) {
    console.error('Error saving uploaded file:', error)
    return NextResponse.json({ error: error.message || 'File upload failed' }, { status: 500 })
  }
}
