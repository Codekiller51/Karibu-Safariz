const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateOrderRequest {
  booking_data: any;
  amount: number;
  currency: string;
  description: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { booking_data, amount, currency, description }: CreateOrderRequest = await req.json()

    // PayPal API configuration
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')
    const PAYPAL_BASE_URL = Deno.env.get('PAYPAL_BASE_URL') || 'https://api-m.sandbox.paypal.com'

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.error('PayPal credentials missing:', {
        PAYPAL_CLIENT_ID: PAYPAL_CLIENT_ID ? 'present' : 'missing',
        PAYPAL_CLIENT_SECRET: PAYPAL_CLIENT_SECRET ? 'present' : 'missing'
      })
      
      return new Response(
        JSON.stringify({
          error: 'PayPal credentials not configured',
          message: 'Please configure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Supabase Edge Function environment variables'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        },
      )
    }

    // Get PayPal access token
    const authResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`
      },
      body: 'grant_type=client_credentials'
    })

    if (!authResponse.ok) {
      const errorText = await authResponse.text()
      console.error('PayPal auth failed:', errorText)
      throw new Error('Failed to get PayPal access token')
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: booking_data.tour_id,
        description: description,
        custom_id: `booking_${Date.now()}`,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: currency,
              value: booking_data.base_price.toFixed(2)
            },
            tax_total: {
              currency_code: currency,
              value: booking_data.additional_fees.reduce((sum: number, fee: any) => sum + fee.amount, 0).toFixed(2)
            }
          }
        },
        items: [
          {
            name: `Tour Booking - ${booking_data.participants} participants`,
            description: description,
            unit_amount: {
              currency_code: currency,
              value: (booking_data.base_price / booking_data.participants).toFixed(2)
            },
            quantity: booking_data.participants.toString(),
            category: 'DIGITAL_GOODS'
          },
          ...booking_data.additional_fees.map((fee: any) => ({
            name: fee.name,
            description: fee.description,
            unit_amount: {
              currency_code: currency,
              value: fee.amount.toFixed(2)
            },
            quantity: '1',
            category: 'DIGITAL_GOODS'
          }))
        ],
        payee: {
          email_address: Deno.env.get('PAYPAL_MERCHANT_EMAIL') || 'merchant@kilimanjarogates.com'
        }
      }],
      application_context: {
        brand_name: 'Karibu Safariz Tours',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/booking/success`,
        cancel_url: `${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/booking/cancel`
      }
    }

    const createOrderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify(orderData)
    })

    if (!createOrderResponse.ok) {
      const errorData = await createOrderResponse.text()
      console.error('PayPal order creation failed:', errorData)
      throw new Error('Failed to create PayPal order')
    }

    const orderResult = await createOrderResponse.json()

    // Log the order creation for audit purposes
    console.log('PayPal order created:', {
      order_id: orderResult.id,
      amount: amount,
      currency: currency,
      customer: booking_data.customer_name,
      tour_id: booking_data.tour_id
    })

    return new Response(
      JSON.stringify({
        id: orderResult.id,
        status: orderResult.status,
        links: orderResult.links
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error creating PayPal order:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Failed to create payment order',
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateOrderRequest {
  booking_data: any;
  amount: number;
  currency: string;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { booking_data, amount, currency, description }: CreateOrderRequest = await req.json()

    // PayPal API configuration
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')
    const PAYPAL_BASE_URL = Deno.env.get('PAYPAL_BASE_URL') || 'https://api-m.sandbox.paypal.com' // Use sandbox for testing

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured')
    }

    // Get PayPal access token
    const authResponse = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`
      },
      body: 'grant_type=client_credentials'
    })

    if (!authResponse.ok) {
      throw new Error('Failed to get PayPal access token')
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Create PayPal order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: booking_data.tour_id,
        description: description,
        custom_id: `booking_${Date.now()}`,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: currency,
              value: booking_data.base_price.toFixed(2)
            },
            tax_total: {
              currency_code: currency,
              value: booking_data.additional_fees.reduce((sum: number, fee: any) => sum + fee.amount, 0).toFixed(2)
            }
          }
        },
        items: [
          {
            name: `Tour Booking - ${booking_data.participants} participants`,
            description: description,
            unit_amount: {
              currency_code: currency,
              value: (booking_data.base_price / booking_data.participants).toFixed(2)
            },
            quantity: booking_data.participants.toString(),
            category: 'DIGITAL_GOODS'
          },
          ...booking_data.additional_fees.map((fee: any) => ({
            name: fee.name,
            description: fee.description,
            unit_amount: {
              currency_code: currency,
              value: fee.amount.toFixed(2)
            },
            quantity: '1',
            category: 'DIGITAL_GOODS'
          }))
        ],
        payee: {
          email_address: Deno.env.get('PAYPAL_MERCHANT_EMAIL') || 'merchant@kilimanjarogates.com'
        }
      }],
      application_context: {
        brand_name: 'Karibu Safariz Tours',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/booking/success`,
        cancel_url: `${Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'}/booking/cancel`
      }
    }

    const createOrderResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      body: JSON.stringify(orderData)
    })

    if (!createOrderResponse.ok) {
      const errorData = await createOrderResponse.text()
      console.error('PayPal order creation failed:', errorData)
      throw new Error('Failed to create PayPal order')
    }

    const orderResult = await createOrderResponse.json()

    // Log the order creation for audit purposes
    console.log('PayPal order created:', {
      order_id: orderResult.id,
      amount: amount,
      currency: currency,
      customer: booking_data.customer_name,
      tour_id: booking_data.tour_id
    })

    return new Response(
      JSON.stringify({
        id: orderResult.id,
        status: orderResult.status,
        links: orderResult.links
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error creating PayPal order:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Failed to create payment order',
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})