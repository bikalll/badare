import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const resendApiKey = Deno.env.get('RESEND_API_KEY') || 're_h6NQcFNi_7WXxSeZ5JVNRbVPCQbCrWUXw';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderDetails, customerEmail, adminEmail = 'admin@yoursite.com' } = await req.json()

    // 1. Email to Admin
    const adminEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Badare Store <onboarding@resend.dev>',
        to: [adminEmail],
        subject: `New Order Alert! #${orderDetails.orderNumber}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 24px; background: #fafafa; color: #000;">
            <div style="background: #000; color: #fff; padding: 8px 16px; margin-bottom: 24px; display: inline-block; border-bottom: 4px solid #ff0000;">
                <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 2px;">NEW ORDER FIRED</h1>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tbody>
                <tr>
                    <td style="padding: 12px; border: 1px solid #000; font-weight: bold; width: 40%; background: #eee;">ORDER ID</td>
                    <td style="padding: 12px; border: 1px solid #000; font-family: monospace; font-size: 16px; font-weight: bold;">${orderDetails.orderNumber}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #000; font-weight: bold; background: #eee;">CUSTOMER EMAIL</td>
                    <td style="padding: 12px; border: 1px solid #000;">${customerEmail}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; border: 1px solid #000; font-weight: bold; background: #eee;">REVENUE</td>
                    <td style="padding: 12px; border: 1px solid #000; font-size: 24px;"><strong>NPR ${orderDetails.total}</strong></td>
                </tr>
              </tbody>
            </table>
            <p style="font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
              ACCESS YOUR SUPABASE PANEL TO VIEW THE FULL INVENTORY MANIFEST FOR THIS ORDER.
            </p>
          </div>
        `
      })
    })

    if (!adminEmailRes.ok) {
        const errorText = await adminEmailRes.text();
        throw new Error(`Failed to send email. Resend Response: ${errorText}`);
    }

    return new Response(
      JSON.stringify({ message: "Emails sent successfully" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
