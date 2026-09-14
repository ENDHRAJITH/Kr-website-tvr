import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export interface RAGKnowledgeDoc {
  id: string
  filename: string
  title: string
  content_text: string
  created_at: string
}

let inMemoryRagDocs: RAGKnowledgeDoc[] = [
  {
    id: 'doc_default_1',
    filename: 'kr_services_overview.pdf',
    title: 'KR Official Services & Packages Guide',
    content_text: 'KR Digital Marketing & Studioz offers complete wedding cinematography, pre-wedding films, baby shoots, model shoots, SEO, Google & Instagram Ads, branding, and influencer marketing. Founders: Rajitha (KR Studioz) & Karthik (KR Digital). Contact: +91 96267 59859.',
    created_at: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_stats')
      .select('*')
      .like('label', 'rag_doc_%')

    if (data && data.length > 0) {
      const dbDocs: RAGKnowledgeDoc[] = data.map((row: any) => {
        try {
          const parsed = JSON.parse(row.value)
          return {
            id: row.id,
            filename: parsed.filename || row.label.replace('rag_doc_', ''),
            title: parsed.title || 'Knowledge Document',
            content_text: parsed.content_text || '',
            created_at: parsed.created_at || new Date().toISOString(),
          }
        } catch {
          return {
            id: row.id,
            filename: row.label.replace('rag_doc_', ''),
            title: row.label.replace('rag_doc_', ''),
            content_text: row.value,
            created_at: new Date().toISOString(),
          }
        }
      })

      return NextResponse.json({ success: true, docs: dbDocs })
    }

    return NextResponse.json({ success: true, docs: inMemoryRagDocs })
  } catch {
    return NextResponse.json({ success: true, docs: inMemoryRagDocs })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, filename, content_text } = body

    if (!title || !content_text) {
      return NextResponse.json(
        { error: 'Document title and text content are required.' },
        { status: 400 }
      )
    }

    const cleanFilename = String(filename || title || 'doc.pdf').replace(/[^a-zA-Z0-9._-]/g, '_')
    const docId = `rag_doc_${Date.now()}`

    const newDoc: RAGKnowledgeDoc = {
      id: docId,
      filename: cleanFilename,
      title: String(title).trim(),
      content_text: String(content_text).trim(),
      created_at: new Date().toISOString(),
    }

    inMemoryRagDocs.push(newDoc)

    try {
      const supabase = await createClient()
      await supabase.from('site_stats').insert([
        {
          label: `rag_doc_${cleanFilename}`,
          value: JSON.stringify(newDoc),
          icon: 'file-text',
          display_order: 100,
        },
      ])
    } catch (err) {
      console.warn('Supabase DB RAG doc insert notice:', err)
    }

    return NextResponse.json({
      success: true,
      doc: newDoc,
      message: `PDF Knowledge document "${title}" uploaded successfully for LangChain RAG!`,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to upload RAG document' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const docId = searchParams.get('id')

    if (!docId) {
      return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 })
    }

    inMemoryRagDocs = inMemoryRagDocs.filter((d) => d.id !== docId)

    try {
      const supabase = await createClient()
      await supabase.from('site_stats').delete().eq('id', docId)
    } catch (err) {
      console.warn('Supabase DB RAG doc delete notice:', err)
    }

    return NextResponse.json({ success: true, message: 'RAG Knowledge document deleted.' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete doc' }, { status: 500 })
  }
}
