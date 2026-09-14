import { NextResponse } from 'next/server'
import { runKRAIRagChain } from '@/lib/rag/langchainChain'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const question = String(body.question || body.message || '').trim()

    if (!question) {
      return NextResponse.json(
        { error: 'Please enter a valid question or message.' },
        { status: 400 }
      )
    }

    // Execute LangChain RAG pipeline with database context
    const result = await runKRAIRagChain(question)

    return NextResponse.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
    })
  } catch (err: any) {
    console.error('Error in AI Chat RAG route:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error processing AI response' },
      { status: 500 }
    )
  }
}
