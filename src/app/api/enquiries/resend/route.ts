import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { generateEnquiryEmailHtml } from '@/lib/emailTemplates'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const enquiryId = body.enquiryId || body.enquiry_id

    if (!enquiryId) {
      return NextResponse.json(
        { error: 'Enquiry ID is required to resend email.' },
        { status: 400 }
      )
    }

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured on the server. Please add RESEND_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    // Fetch Enquiry Details from Supabase
    const supabase = await createClient()
    const { data: enquiry, error: fetchErr } = await supabase
      .from('enquiries')
      .select('*, enquiry_items(*)')
      .eq('id', enquiryId)
      .single()

    if (fetchErr || !enquiry) {
      return NextResponse.json(
        { error: `Failed to find enquiry record: ${fetchErr?.message || 'Not found'}` },
        { status: 404 }
      )
    }

    // Prepare Resend Email Data
    const resend = new Resend(resendApiKey)
    const recipientEmail = process.env.NOTIFICATION_EMAIL || 'kr.digital.studioz@gmail.com'

    const emailHtml = generateEnquiryEmailHtml({
      name: enquiry.name || 'Client',
      email: enquiry.email || 'Not Provided',
      phone: enquiry.phone || 'Not Provided',
      category: enquiry.event_type || 'General Enquiry',
      service: enquiry.event_type || 'General Enquiry',
      message: enquiry.message || '',
      items: (enquiry.enquiry_items || []).map((item: any) => ({
        name: item.service_name || 'Service',
        category: item.service_division || 'general',
      })),
    })

    const emailResult = await resend.emails.send({
      from: 'KR Website <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `⚡ Resent: Enquiry from ${enquiry.name} — KR Digital & Studioz`,
      html: emailHtml,
    })

    if (emailResult.error) {
      return NextResponse.json(
        { error: `Resend API Error: ${emailResult.error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Email resent successfully to ${recipientEmail}!`,
      resendId: emailResult.data?.id,
    })
  } catch (err: any) {
    console.error('Error in Resend email route:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error while resending email' },
      { status: 500 }
    )
  }
}
