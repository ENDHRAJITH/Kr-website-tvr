import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { getLiveDatabaseContext } from './dbRetriever'

/**
 * LangChain RAG Prompt Template for KR Digital Marketing & Studioz Assistant.
 */
const SYSTEM_RAG_PROMPT = `You are KR AI Assistant, the intelligent, friendly, and expert consultant for KR Digital Marketing & KR Studioz.
Your job is to assist website visitors with their enquiries about photography, wedding films, SEO, branding, ads, founder details, and direct contact options.

Rules:
1. Base your answer STRICTLY on the retrieved database knowledge provided below.
2. If the user asks about wedding photography, baby shoots, model shoots, traditional functions, or pre-wedding films, highlight KR Studioz services and recommend contacting Rajitha (Founder - Studioz) or Karthik.
3. If the user asks about SEO, Google Ads, Instagram/YouTube marketing, branding, or business growth, highlight KR Digital services and recommend contacting Karthik (Founder - KR Digital).
4. Always provide clear, professional, and enthusiastic responses. Use bullet points or bold text where appropriate.
5. If the exact answer isn't in the context, give a helpful general answer based on KR services and prompt them to reach out on WhatsApp (+91 96267 59859).

--- LIVE DATABASE CONTEXT ---
{context}
-----------------------------

User Question: {question}

Helpful Answer:`

export interface ChatRAGResponse {
  answer: string
  sources: Array<{ title: string; category?: string; division?: string }>
}

/**
 * LangChain Runnable Chain Executor:
 * 1. Fetches live Supabase database knowledge.
 * 2. Formats prompt with LangChain ChatPromptTemplate.
 * 3. Uses Gemini API (if GEMINI_API_KEY or GOOGLE_API_KEY set) or OpenAI API (if OPENAI_API_KEY set) or smart DB RAG engine.
 */
export async function runKRAIRagChain(question: string): Promise<ChatRAGResponse> {
  // 1. Fetch Live Supabase Knowledge Base Documents & Context
  const { documents, contextString } = await getLiveDatabaseContext(question)

  const sources = documents
    .filter((doc) => doc.metadata.title && doc.metadata.title !== 'undefined')
    .map((doc) => ({
      title: String(doc.metadata.title),
      category: doc.metadata.category as string | undefined,
      division: doc.metadata.division as string | undefined,
    }))

  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  const openAiKey = process.env.OPENAI_API_KEY

  const promptTemplate = ChatPromptTemplate.fromTemplate(SYSTEM_RAG_PROMPT)
  const outputParser = new StringOutputParser()

  // Format prompt using LangChain ChatPromptTemplate
  const formattedPrompt = await promptTemplate.format({
    context: contextString,
    question,
  })

  // 2A. If Google Gemini API key is configured
  if (geminiApiKey) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: formattedPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 800,
            },
          }),
        }
      )

      const geminiData = await geminiRes.json()
      if (geminiRes.ok && geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
        const rawContent = geminiData.candidates[0].content.parts[0].text
        const parsed = await outputParser.parse(rawContent)
        return {
          answer: parsed.trim(),
          sources,
        }
      } else if (geminiData.error) {
        console.warn('Gemini API Error:', geminiData.error.message)
      }
    } catch (err) {
      console.warn('Gemini API invocation error, trying fallback:', err)
    }
  }

  // 2B. If OpenAI API Key is configured
  if (openAiKey) {
    try {
      const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are KR AI Assistant powered by LangChain RAG & live Supabase database.',
            },
            { role: 'user', content: formattedPrompt },
          ],
          temperature: 0.3,
        }),
      })

      const aiData = await openAiRes.json()
      if (openAiRes.ok && aiData.choices?.[0]?.message?.content) {
        const rawContent = aiData.choices[0].message.content
        const parsed = await outputParser.parse(rawContent)
        return {
          answer: parsed.trim(),
          sources,
        }
      }
    } catch (err) {
      console.warn('OpenAI API call warning, fallback to LangChain RAG synthesis:', err)
    }
  }

  // 3. LangChain Smart RAG Synthesis Engine using retrieved DB documents
  const synthesizedAnswer = generateSmartRAGFallback(question, documents)

  return {
    answer: synthesizedAnswer,
    sources,
  }
}

/**
 * Smart RAG Synthesis fallback when external API key is not configured.
 */
function generateSmartRAGFallback(
  question: string,
  documents: any[]
): string {
  const qLower = question.toLowerCase()

  if (qLower.includes('wedding') || qLower.includes('photography') || qLower.includes('shoot') || qLower.includes('studioz')) {
    const studiozDocs = documents.filter((d) => d.metadata.division === 'studioz' || d.metadata.source === 'studioz_services')
    const validTitles = Array.from(
      new Set(studiozDocs.map((d) => d.metadata.title).filter((t) => t && t !== 'undefined'))
    )
    const serviceNames = validTitles.map((title) => `• **${title}**`).join('\n')

    return `✨ **KR Studioz Photography & Cinematic Services**\n\nWe offer complete visual storytelling for your special moments!\n\n**Popular Services from Database:**\n${serviceNames || '• Wedding Photography & Cinematography\n• Pre-Wedding Shoots\n• Baby Shoots & Traditional Ceremonies\n• Model Shoots'}\n\nOur team led by founder **Rajitha** captures moments with cinematic brilliance.\n\n📲 **Ready to book or get a custom quote?**\nClick the WhatsApp button below or call us directly at **+91 96267 59859**!`
  }

  if (qLower.includes('seo') || qLower.includes('marketing') || qLower.includes('ad') || qLower.includes('brand') || qLower.includes('digital')) {
    const marketingDocs = documents.filter((d) => d.metadata.division === 'marketing' || d.metadata.source === 'marketing_services')
    const validTitles = Array.from(
      new Set(marketingDocs.map((d) => d.metadata.title).filter((t) => t && t !== 'undefined'))
    )
    const serviceNames = validTitles.map((title) => `• **${title}**`).join('\n')

    return `🚀 **KR Digital Marketing Solutions**\n\nScale your brand and drive real ROI with targeted digital strategies!\n\n**Live Growth Services:**\n${serviceNames || '• Search Engine Optimization (SEO)\n• Google & Instagram Ads\n• Influencer Marketing\n• Branding & Visual Identity\n• YouTube Video Marketing'}\n\nManaged under the leadership of founder **Karthik**.\n\n📈 **Want to audit your brand or launch a campaign?**\nContact Karthik directly on WhatsApp at **+91 96267 59859**!`
  }

  if (qLower.includes('contact') || qLower.includes('phone') || qLower.includes('number') || qLower.includes('email') || qLower.includes('address') || qLower.includes('karthik') || qLower.includes('rajitha')) {
    return `📞 **KR Digital & Studioz Contact Details**\n\n• **Phone / WhatsApp:** +91 96267 59859\n• **Email:** kr.digital.studioz@gmail.com\n• **Founders:**\n  - **Rajitha** (KR Studioz Founder)\n  - **Karthik** (KR Digital Marketing Founder)\n• **Location:** Tamil Nadu, India\n\nYou can also click **"Add to Enquiry Cart"** or use the WhatsApp drawer anytime to send us a direct message!`
  }

  // Default RAG Response combining top matched DB docs
  const topHighlights = documents
    .filter((d) => d.metadata.title && d.metadata.title !== 'undefined')
    .slice(0, 4)
    .map((d) => `• **${d.metadata.title}**: ${d.pageContent.slice(0, 150)}...`)
    .join('\n')

  return `🤖 **KR AI Assistant (Database RAG Context)**\n\nHeres what I found in our live database for your request:\n\n${topHighlights || '• Full range of Studioz photography & Digital Marketing growth packages.'}\n\n💬 **Have specific requirements?**\nReach out to Karthik & Rajitha directly on WhatsApp (**+91 96267 59859**) or send an enquiry via our cart!`
}
