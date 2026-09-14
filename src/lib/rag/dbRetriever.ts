import { createClient } from '@/lib/supabase/server'
import { Document } from '@langchain/core/documents'

export interface KRVectorDocument {
  id: string
  content: string
  metadata: {
    source: string
    title: string
    category?: string
    division?: 'studioz' | 'marketing' | 'general'
    url?: string
    price?: string
  }
}

/**
 * Live Database Knowledge Base Retriever for KR Digital Marketing & Studioz.
 * Fetches all live services, team members, founders, portfolio work, stats, and uploaded PDF RAG docs directly from Supabase.
 */
export async function getLiveDatabaseContext(userQuery: string): Promise<{
  documents: Document[]
  contextString: string
}> {
  const documents: Document[] = []

  try {
    const supabase = await createClient()

    // 1. Fetch Studioz Services
    const { data: studiozServices } = await supabase
      .from('studioz_services')
      .select('*')

    if (studiozServices && studiozServices.length > 0) {
      studiozServices.forEach((s: any) => {
        const serviceName = s.name || s.title || s.label || 'Studioz Service'
        const coverPoints = Array.isArray(s.cover_points)
          ? s.cover_points.join(', ')
          : Array.isArray(s.features)
          ? s.features.join(', ')
          : ''

        const text = `[KR Studioz Service] Title: ${serviceName}. Category: ${s.category || 'Photography & Films'}. Description: ${s.description || ''}. Price: ${s.price ? `${s.price}` : 'Custom Quote'}. Features: ${coverPoints}.`
        documents.push(
          new Document({
            pageContent: text,
            metadata: {
              source: 'studioz_services',
              title: serviceName,
              category: s.category || 'Photography',
              division: 'studioz',
              price: s.price,
            },
          })
        )
      })
    }

    // 2. Fetch Marketing Services
    const { data: marketingServices } = await supabase
      .from('marketing_services')
      .select('*')

    if (marketingServices && marketingServices.length > 0) {
      marketingServices.forEach((s: any) => {
        const serviceName = s.name || s.title || s.subtitle || 'Digital Marketing Service'
        const features = Array.isArray(s.features)
          ? s.features.join(', ')
          : Array.isArray(s.benefits)
          ? s.benefits.join(', ')
          : ''

        const text = `[KR Digital Marketing Service] Title: ${serviceName}. Subtitle: ${s.subtitle || ''}. Description: ${s.description || ''}. Price: ${s.price ? `${s.price}` : 'Custom Growth Package'}. Features: ${features}.`
        documents.push(
          new Document({
            pageContent: text,
            metadata: {
              source: 'marketing_services',
              title: serviceName,
              category: 'Digital Marketing',
              division: 'marketing',
              price: s.price,
            },
          })
        )
      })
    }

    // 3. Fetch Founder Decks & Vision
    const { data: founderDecks } = await supabase
      .from('founder_decks')
      .select('*')

    if (founderDecks && founderDecks.length > 0) {
      founderDecks.forEach((f: any) => {
        const founderName = f.founder_name || f.name || 'Founder'
        const text = `[KR Founder Profile] Name: ${founderName}. Role: ${f.founder_role || f.role_title || 'Founder'}. Division: ${f.division}. Bio: ${f.bio || ''}. Vision: ${f.vision_statement || ''}. Social Links: YT: ${f.youtube_url || 'N/A'}, Insta: ${f.instagram_url || 'N/A'}, WhatsApp: ${f.whatsapp_url || 'N/A'}, LinkedIn: ${f.linkedin_url || 'N/A'}.`
        documents.push(
          new Document({
            pageContent: text,
            metadata: {
              source: 'founder_decks',
              title: `${founderName} (${f.division === 'studioz' ? 'KR Studioz' : 'KR Digital'})`,
              division: f.division,
            },
          })
        )
      })
    }

    // 4. Fetch Team Members ("The People Behind KR")
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select('*')

    if (teamMembers && teamMembers.length > 0) {
      teamMembers.forEach((t: any) => {
        const memberName = t.name || 'Team Member'
        const text = `[KR Team Member] Name: ${memberName}. Role: ${t.role || 'Specialist'}. Division: ${t.division || 'General'}. Bio: ${t.bio || ''}. Social Links: YT: ${t.youtube_url || 'N/A'}, Insta: ${t.instagram_url || 'N/A'}, WhatsApp: ${t.whatsapp_url || 'N/A'}.`
        documents.push(
          new Document({
            pageContent: text,
            metadata: {
              source: 'team_members',
              title: memberName,
              division: t.division,
            },
          })
        )
      })
    }

    // 5. Fetch Key Portfolio Highlights
    const { data: portfolioItems } = await supabase
      .from('portfolio_items')
      .select('*')
      .limit(20)

    if (portfolioItems && portfolioItems.length > 0) {
      portfolioItems.forEach((p: any) => {
        const projectTitle = p.title || p.name || 'Portfolio Project'
        const text = `[KR Portfolio Showcase] Project: ${projectTitle}. Category: ${p.category || 'General'}. Client: ${p.client_name || 'N/A'}. Division: ${p.category === 'digital' ? 'marketing' : 'studioz'}. Details: ${p.description || ''}.`
        documents.push(
          new Document({
            pageContent: text,
            metadata: {
              source: 'portfolio_items',
              title: projectTitle,
              category: p.category,
              division: p.category === 'digital' ? 'marketing' : 'studioz',
            },
          })
        )
      })
    }

    // 6. Fetch Uploaded PDF RAG Knowledge Documents
    const { data: ragDocs } = await supabase
      .from('site_stats')
      .select('*')
      .like('label', 'rag_doc_%')

    if (ragDocs && ragDocs.length > 0) {
      ragDocs.forEach((row: any) => {
        try {
          const parsed = JSON.parse(row.value)
          const docTitle = parsed.title || row.label.replace('rag_doc_', '')
          const docText = parsed.content_text || ''

          documents.push(
            new Document({
              pageContent: `[Admin Uploaded Knowledge Doc] Title: ${docTitle}. File: ${parsed.filename || 'PDF'}. Knowledge Content: ${docText}`,
              metadata: {
                source: 'uploaded_pdf',
                title: docTitle,
                category: 'Knowledge Doc',
                division: 'general',
              },
            })
          )
        } catch {
          documents.push(
            new Document({
              pageContent: `[Admin Uploaded Knowledge Doc] ${row.value}`,
              metadata: {
                source: 'uploaded_pdf',
                title: row.label.replace('rag_doc_', ''),
                category: 'Knowledge Doc',
                division: 'general',
              },
            })
          )
        }
      })
    }

    // 7. Base Agency Info
    documents.push(
      new Document({
        pageContent: `[KR Contact & Location Info] Phone / WhatsApp: +91 96267 59859. Email: kr.digital.studioz@gmail.com. Founders: Rajitha (Founder - KR Studioz) & Karthik (Founder - KR Digital Marketing). Address: Tamil Nadu, India. Website: https://krdigitalstudioz.com`,
        metadata: {
          source: 'contact_info',
          title: 'KR Contact Details',
          division: 'general',
        },
      })
    )
  } catch (err) {
    console.warn('Error building live database retriever context:', err)
  }

  // Perform lightweight keyword / relevance scoring to prioritize top matching documents
  const lowerQuery = userQuery.toLowerCase()
  const scoredDocs = documents.map((doc) => {
    let score = 0
    const contentLower = doc.pageContent.toLowerCase()
    const titleLower = (doc.metadata.title || '').toLowerCase()

    const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2)
    queryWords.forEach((word) => {
      if (titleLower.includes(word)) score += 5
      if (contentLower.includes(word)) score += 2
    })

    return { doc, score }
  })

  // Sort by score descending and pick top matches (or all if query is broad)
  scoredDocs.sort((a, b) => b.score - a.score)
  const topDocs = scoredDocs.slice(0, 10).map((sd) => sd.doc)

  const contextString = topDocs.map((d) => d.pageContent).join('\n---\n')

  return {
    documents: topDocs,
    contextString,
  }
}
