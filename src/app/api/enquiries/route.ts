import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { generateEnquiryEmailHtml } from '@/lib/emailTemplates'

// In-memory sliding window rate limiter (5 requests per 10 minutes per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count += 1
  return false
}

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for')
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

    if (checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Too many enquiry submissions from your network. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      name,
      email = '',
      phone = '',
      event_type,
      category,
      service,
      event_date,
      message = '',
      items = []
    } = body

    // 2. Strict Input Validation & Sanitization
    const cleanName = String(name || '').trim().slice(0, 100)
    const cleanEmail = String(email || '').trim().slice(0, 100)
    const cleanPhone = String(phone || '').trim().slice(0, 30)
    const cleanMessage = String(message || '').trim().slice(0, 2000)
    const cleanEventType = String(event_type || category || service || 'General Enquiry').trim().slice(0, 100)
    const cleanEventDate = String(event_date || '').trim().slice(0, 50)
    const cleanItems = Array.isArray(items) ? items.slice(0, 20) : []

    if (!cleanName || (!cleanPhone && !cleanEmail)) {
      return NextResponse.json(
        { error: 'Name and either phone or email are required.' },
        { status: 400 }
      )
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // 3. Store in Supabase DB if client is active
    let dbSuccess = false
    let enquiryId: string | undefined = undefined

    try {
      const supabase = await createClient()
      const { data: enquiry, error } = await supabase
        .from('enquiries')
        .insert({
          name: cleanName,
          phone: cleanPhone,
          event_type: cleanEventType,
          message: cleanMessage,
        })
        .select()
        .single()

      if (!error && enquiry) {
        dbSuccess = true
        enquiryId = enquiry.id

        if (cleanItems.length) {
          await supabase.from('enquiry_items').insert(
            cleanItems.map((i: any) => ({
              enquiry_id: enquiry.id,
              service_division: String(i.division || i.category || 'general').slice(0, 50),
              service_id: String(i.id || 'custom').slice(0, 100),
              service_name: String(i.name || '').slice(0, 150),
            }))
          )
        }
      }
    } catch (dbErr) {
      console.warn('Supabase DB insertion skipped/warning:', dbErr)
    }

    // 4. Send HTML Email via Resend (Strict Server-side API key)
    let emailSent = false
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)
        const recipientEmail = process.env.NOTIFICATION_EMAIL || 'kr.digital.studioz@gmail.com'
        const emailHtml = generateEnquiryEmailHtml({
          name: cleanName,
          email: cleanEmail || 'Not Provided',
          phone: cleanPhone || 'Not Provided',
          category: cleanEventType,
          service: service || cleanEventType,
          event_date: cleanEventDate,
          message: cleanMessage,
          items: cleanItems,
        })

        const emailResult = await resend.emails.send({
          from: 'KR Website <onboarding@resend.dev>',
          to: [recipientEmail],
          subject: `⚡ New Enquiry from ${cleanName} — KR Digital & Studioz`,
          html: emailHtml,
        })

        if (!emailResult.error) {
          emailSent = true
        } else {
          console.error('Resend email error:', emailResult.error)
        }
      } catch (emailErr) {
        console.error('Error sending Resend email:', emailErr)
      }
    } else {
      console.log('RESEND_API_KEY not configured. Email notification skipped gracefully.')
    }

    return NextResponse.json({
      success: true,
      id: enquiryId,
      dbStored: dbSuccess,
      emailSent,
      message: 'Enquiry processed successfully!',
    })
  } catch (err: any) {
    console.error('Error handling enquiry POST:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


