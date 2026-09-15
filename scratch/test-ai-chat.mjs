import fs from 'fs'

// Load .env.local manually
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valParts] = trimmed.split('=')
      process.env[key.trim()] = valParts.join('=').trim()
    }
  }
} catch (e) {
  console.warn('Could not load .env.local file:', e)
}

import { runKRAIRagChain } from '../src/lib/rag/langchainChain.ts'

async function testAI() {
  console.log('--- TESTING AI & RAG WITH GEMINI API KEY ---')
  console.log('Gemini API Key Loaded:', process.env.GEMINI_API_KEY ? '✅ YES' : '❌ NO')
  console.log('Resend API Key Loaded:', process.env.RESEND_API_KEY ? '✅ YES' : '❌ NO')
  console.log('Notification Email Loaded:', process.env.NOTIFICATION_EMAIL || 'None')

  try {
    const result = await runKRAIRagChain('Hi, tell me about KR Studioz pre wedding and wedding packages!')
    console.log('\n--- AI RESPONSE OUTPUT ---')
    console.log(result.answer)
    console.log('\n--- SOURCES RETRIEVED ---')
    console.log(result.sources)
  } catch (err) {
    console.error('Error running AI RAG Chain:', err)
  }
}

testAI()
