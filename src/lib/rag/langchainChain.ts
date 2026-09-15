import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { getLiveDatabaseContext } from './dbRetriever'

/**
 * RAG Prompt Template for Lossy AI Assistant (KR Digital Marketing & Studioz).
 */
const SYSTEM_RAG_PROMPT = `You are Lossy AI, the intelligent, friendly, and expert consultant for KR Digital Marketing & KR Studioz.
Your job is to assist website visitors with their enquiries about photography, wedding films, SEO, branding, ads, founder details, and direct contact options.

Rules:
1. Base your answer STRICTLY on the retrieved database knowledge provided below.
2. If the user asks about wedding photography, baby shoots, model shoots, traditional functions, or pre-wedding films, highlight KR Studioz services and recommend contacting Rajitha (Founder - Studioz) or Karthik.
3. If the user asks about SEO, Google Ads, Instagram/YouTube marketing, branding, or business growth, highlight KR Digital services and recommend contacting Karthik (Founder - KR Digital).
4. Always provide clear, professional, and enthusiastic responses. Use bullet points or bold text where appropriate.
5. If the user asks about founders, mention Rajitha (Founder of KR Studioz) and Karthik (Founder of KR Digital Marketing).
6. Never output technical jargon like "Database RAG Context", "LangChain", or internal system terms. Keep responses natural, human, and professional.

--- LIVE DATABASE KNOWLEDGE ---
{context}
-----------------------------

User Question: {question}

Helpful Answer:`

export interface ChatRAGResponse {
  answer: string
  sources: Array<{ title: string; category?: string; division?: string }>
}

/**
 * Runnable Chain Executor:
 * 1. Fetches live Supabase database knowledge.
 * 2. Formats prompt with ChatPromptTemplate.
 * 3. Uses Gemini API / OpenAI API / Smart Fallback Engine.
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

  // Format prompt using ChatPromptTemplate
  const formattedPrompt = await promptTemplate.format({
    context: contextString,
    question,
  })

  // 2A. If Google Gemini API key is configured
  if (geminiApiKey) {
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-pro']
    for (const modelName of modelsToTry) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`,
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
        }
      } catch (err) {
        console.warn(`Gemini API invocation error with model ${modelName}:`, err)
      }
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
              content: 'You are Lossy AI, assistant for KR Studioz & KR Digital Marketing.',
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
      console.warn('OpenAI API call warning, fallback to Lossy AI engine:', err)
    }
  }

  // 3. Smart Synthesis Fallback Engine when external API keys are pending
  const synthesizedAnswer = generateSmartFallback(question, documents)

  return {
    answer: synthesizedAnswer,
    sources,
  }
}

/**
 * Smart Synthesis fallback engine for Lossy AI.
 */
function generateSmartFallback(
  question: string,
  documents: any[]
): string {
  const qLower = question.toLowerCase()

  // Greetings
  if (['hi', 'hello', 'hey', 'greetings', 'who are you'].includes(qLower) || qLower === 'hi' || qLower === 'hello') {
    return `👋 **Hello! I'm Lossy AI.**\n\nWelcome to KR Studioz & Digital Marketing! How can I assist you today?\n\n- 📸 Photography & Film Packages\n- 🚀 SEO & Digital Marketing Services\n- 💼 Founder Portfolios & Contact Details`
  }

  // Founder questions
  if (qLower.includes('founder') || qLower.includes('who is founder') || qLower.includes('karthik') || qLower.includes('rajitha') || qLower.includes('owner')) {
    return `✨ **Meet the Founders of KR:**\n\n• **Rajitha**: Founder & Creative Director of **KR Studioz** (Specializes in high-end wedding cinematography, candid photography & visual direction).\n• **Karthik**: Founder & Managing Director of **KR Digital Marketing** (Lead strategist & growth marketer driving SEO, social media & performance ads).\n\nTogether, Karthik & Rajitha bring full-service photography, videography, and digital branding under one roof!\n\n💬 **Want to get in touch?**\nContact Karthik & Rajitha directly on WhatsApp at **+91 96267 59859**!`
  }

  // Wedding & Studioz services
  if (qLower.includes('wedding') || qLower.includes('photography') || qLower.includes('shoot') || qLower.includes('studioz')) {
    const studiozDocs = documents.filter((d) => d.metadata.division === 'studioz' || d.metadata.source === 'studioz_services')
    const validTitles = Array.from(
      new Set(studiozDocs.map((d) => d.metadata.title).filter((t) => t && t !== 'undefined'))
    )
    const serviceNames = validTitles.map((title) => `• **${title}**`).join('\n')

    return `✨ **KR Studioz Photography & Cinematic Services**\n\nWe provide complete visual storytelling for all your special occasions!\n\n**Featured Services:**\n${serviceNames || '• Grand Wedding Photography & Films\n• Cinematic Pre-Wedding Shoots\n• Traditional Ceremonies & Function Shoots\n• Baby Milestone & Maternity Portraits'}\n\nOur creative vision is led by founder **Rajitha**.\n\n📲 **Ready to book or get a custom quote?**\nReach out to us on WhatsApp at **+91 96267 59859** or add services to your enquiry cart!`
  }

  // Digital Marketing
  if (qLower.includes('seo') || qLower.includes('marketing') || qLower.includes('ad') || qLower.includes('brand') || qLower.includes('digital')) {
    const marketingDocs = documents.filter((d) => d.metadata.division === 'marketing' || d.metadata.source === 'marketing_services')
    const validTitles = Array.from(
      new Set(marketingDocs.map((d) => d.metadata.title).filter((t) => t && t !== 'undefined'))
    )
    const serviceNames = validTitles.map((title) => `• **${title}**`).join('\n')

    return `🚀 **KR Digital Marketing Solutions**\n\nGrow your brand reach and drive measurable ROI with expert marketing strategies!\n\n**Our Core Solutions:**\n${serviceNames || '• Search Engine Optimization (SEO)\n• Performance Social Media Ads\n• Influencer Marketing Campaigns\n• Brand Strategy & Identity\n• Video Content Creation'}\n\nLed by founder **Karthik**.\n\n📈 **Want a brand audit or campaign strategy?**\nChat with Karthik directly on WhatsApp at **+91 96267 59859**!`
  }

  // Contact details
  if (qLower.includes('contact') || qLower.includes('phone') || qLower.includes('number') || qLower.includes('email') || qLower.includes('address')) {
    return `📞 **KR Digital & Studioz Contact Details**\n\n• **WhatsApp / Phone:** +91 96267 59859\n• **Email:** kr.digital.studioz@gmail.com\n• **Founders:**\n  - **Rajitha** (KR Studioz Founder)\n  - **Karthik** (KR Digital Marketing Founder)\n\nFeel free to drop a message on WhatsApp anytime for instant inquiries!`
  }

  // Clean Default Response
  const cleanHighlights = documents
    .filter((d) => d.metadata.title && d.metadata.title !== 'undefined')
    .slice(0, 3)
    .map((d) => `• **${d.metadata.title}**: ${d.pageContent.replace(/\[.*?\]/g, '').slice(0, 140)}...`)
    .join('\n')

  return `Here is what I found regarding your inquiry:\n\n${cleanHighlights || '• Complete range of KR Studioz Photography & KR Digital Marketing packages.'}\n\n💬 **Have specific requirements?**\nContact Karthik & Rajitha directly on WhatsApp (**+91 96267 59859**) or build your custom enquiry cart!`
}
