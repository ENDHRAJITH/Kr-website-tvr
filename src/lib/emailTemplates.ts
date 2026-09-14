interface EmailEnquiryPayload {
  name: string
  email: string
  phone: string
  category?: string
  service?: string
  event_date?: string
  message?: string
  items?: Array<{ name: string; category?: string; price?: string }>
}

/**
 * Generates a modern HTML email template for new KR website enquiries.
 */
export function generateEnquiryEmailHtml(data: EmailEnquiryPayload): string {
  const { name, email, phone, category, service, event_date, message, items } = data

  const itemsListHtml = items && items.length > 0
    ? items.map(item => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 12px; color: #111827; font-weight: 600; font-size: 14px;">${item.name}</td>
        <td style="padding: 12px; color: #F97316; font-weight: 700; font-size: 12px; text-transform: uppercase; text-align: right;">${item.category || 'Service'}</td>
      </tr>
    `).join('')
    : ''

  const cleanPhone = phone.replace(/[^0-9+]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Website Enquiry — KR Digital Marketing & Studioz</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
          
          <!-- BRAND HEADER -->
          <tr>
            <td style="background-color: #050505; padding: 32px; text-align: center; border-bottom: 4px solid #F97316;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase;">
                KR <span style="color: #F97316;">DIGITAL & STUDIOZ</span>
              </h1>
              <p style="margin: 6px 0 0 0; color: #F97316; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">
                New Website Enquiry Received
              </p>
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.5;">
                You have received a new enquiry from <strong>${name}</strong> via the KR Website contact form.
              </p>

              <!-- CLIENT DETAILS CARD -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; color: #6b7280; font-size: 13px; font-weight: 600; width: 130px;">Client Name:</td>
                        <td style="padding: 6px 0; color: #111827; font-size: 15px; font-weight: 700;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Email Address:</td>
                        <td style="padding: 6px 0; color: #111827; font-size: 15px; font-weight: 600;">
                          <a href="mailto:${email}" style="color: #F97316; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Phone Number:</td>
                        <td style="padding: 6px 0; color: #111827; font-size: 15px; font-weight: 600;">
                          <a href="tel:${phone}" style="color: #111827; text-decoration: none;">${phone}</a>
                        </td>
                      </tr>
                      ${category ? `
                      <tr>
                        <td style="padding: 6px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Category:</td>
                        <td style="padding: 6px 0; color: #F97316; font-size: 14px; font-weight: 700; text-transform: uppercase;">${category}</td>
                      </tr>` : ''}
                      ${service ? `
                      <tr>
                        <td style="padding: 6px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Service Needed:</td>
                        <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${service}</td>
                      </tr>` : ''}
                      ${event_date ? `
                      <tr>
                        <td style="padding: 6px 0; color: #6b7280; font-size: 13px; font-weight: 600;">Event Date:</td>
                        <td style="padding: 6px 0; color: #111827; font-size: 14px; font-weight: 600;">${event_date}</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- SELECTED ITEMS TABLE (IF ENQUIRY CART WAS SUBMITTED) -->
              ${itemsListHtml ? `
              <div style="margin-bottom: 28px;">
                <h3 style="margin: 0 0 12px 0; color: #111827; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">
                  Selected Services / Packages:
                </h3>
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                  ${itemsListHtml}
                </table>
              </div>` : ''}

              <!-- MESSAGE BLOCK -->
              ${message ? `
              <div style="margin-bottom: 28px;">
                <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">
                  Client Message:
                </h3>
                <div style="background-color: #fff7ed; border-left: 4px solid #F97316; padding: 16px; border-radius: 0 8px 8px 0; color: #431407; font-size: 14px; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br/>')}
                </div>
              </div>` : ''}

              <!-- QUICK ACTION BUTTONS -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 32px;">
                <tr>
                  <td align="center">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 6px; margin-right: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
                      WhatsApp Client ↗
                    </a>
                    <a href="mailto:${email}" style="display: inline-block; background-color: #F97316; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em;">
                      Reply via Email ↗
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                This notification was sent automatically from <strong>KR Digital Marketing &amp; Studioz</strong> website system.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
