// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

interface PaymentRequest {
  amount: number;
  currency: string;
  order_id: string;
  billing_data: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  items: Array<{
    name: string;
    amount_cents: number;
    description: string;
    quantity: number;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { amount, currency, order_id, billing_data, items }: PaymentRequest = await req.json()

    // Step 1: Authentication Request
    const authResponse = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: Deno.env.get('PAYMOB_API_KEY'),
      }),
    })

    const authData = await authResponse.json()
    const authToken = authData.token

    // Step 2: Order Registration
    const orderResponse = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amount * 100,
        currency: currency,
        items: items,
      }),
    })

    const orderData = await orderResponse.json()
    const paymobOrderId = orderData.id

    // Step 3: Payment Key Request
    const paymentKeyResponse = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: {
          apartment: "NA",
          email: billing_data.email,
          floor: "NA",
          first_name: billing_data.first_name,
          street: "NA",
          building: "NA",
          phone_number: billing_data.phone_number,
          shipping_method: "NA",
          postal_code: "NA",
          city: "NA",
          country: "EG",
          last_name: billing_data.last_name,
          state: "NA"
        },
        currency: currency,
        integration_id: 4475123, // Replace with your integration ID
      }),
    })

    const paymentKeyData = await paymentKeyResponse.json()
    const paymentToken = paymentKeyData.token

    // Store payment record in database
    const { error: dbError } = await supabaseClient
      .from('orders')
      .insert({
        id: order_id,
        user_id: user.id,
        total_amount: amount,
        currency: currency,
        status: 'pending',
        paymob_order_id: paymobOrderId,
        payment_method: 'paymob',
        created_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
    }

    return new Response(
      JSON.stringify({
        payment_token: paymentToken,
        paymob_order_id: paymobOrderId,
        iframe_url: `https://accept.paymob.com/api/acceptance/iframes/851598?payment_token=${paymentToken}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process payment' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})