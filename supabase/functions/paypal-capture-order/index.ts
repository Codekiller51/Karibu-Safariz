import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CaptureOrderRequest {
  order_id: string;
  booking_data: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { order_id, booking_data }: CaptureOrderRequest = await req.json()

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

    // Capture the PayPal order
    const captureResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${order_id}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `capture_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    })

    if (!captureResponse.ok) {
      const errorData = await captureResponse.text()
      console.error('PayPal capture failed:', errorData)
      throw new Error('Failed to capture PayPal payment')
    }

    const captureResult = await captureResponse.json()
    const capture = captureResult.purchase_units[0].payments.captures[0]

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create booking in database
    const bookingId = crypto.randomUUID()
    const { data: bookingResult, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        id: bookingId,
        user_id: booking_data.user_id || null, // May be null for guest bookings
        tour_id: booking_data.tour_id,
        start_date: booking_data.start_date,
        participants: booking_data.participants,
        total_amount: booking_data.total_amount,
        currency: booking_data.currency,
        status: 'confirmed',
        special_requests: booking_data.special_requests,
        participant_details: booking_data.participant_details,
        payment_status: 'paid',
        payment_reference: capture.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      throw new Error('Failed to create booking record')
    }

    // Create payment record
    const paymentId = crypto.randomUUID()
    const transactionFee = parseFloat(capture.seller_receivable_breakdown?.paypal_fee?.value || '0')
    
    const { data: paymentResult, error: paymentError } = await supabase
      .from('payments')
      .insert({
        id: paymentId,
        booking_id: bookingId,
        payment_method: 'paypal',
        payment_id: capture.id,
        amount: parseFloat(capture.amount.value),
        currency: capture.amount.currency_code,
        status: 'completed',
        transaction_fee: transactionFee,
        paypal_order_id: order_id,
        paypal_payer_id: captureResult.payer?.payer_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Error creating payment record:', paymentError)
      // Don't throw error here as booking was successful
    }

    // Send booking confirmation email (implement email service)
    try {
      await sendBookingConfirmationEmail(booking_data, bookingResult, capture)
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't throw error as payment was successful
    }

    // Schedule post-service survey (implement scheduling service)
    try {
      await schedulePostServiceSurvey(bookingId, booking_data.start_date)
    } catch (surveyError) {
      console.error('Error scheduling survey:', surveyError)
      // Don't throw error as payment was successful
    }

    // Log successful transaction
    console.log('Payment captured successfully:', {
      booking_id: bookingId,
      payment_id: capture.id,
      amount: capture.amount.value,
      currency: capture.amount.currency_code,
      customer: booking_data.customer_name,
      tour_id: booking_data.tour_id
    })

    return new Response(
      JSON.stringify({
        success: true,
        booking_id: bookingId,
        payment_details: {
          id: paymentId,
          booking_id: bookingId,
          payment_method: 'paypal',
          payment_id: capture.id,
          amount: parseFloat(capture.amount.value),
          currency: capture.amount.currency_code,
          status: 'completed',
          transaction_fee: transactionFee,
          paypal_order_id: order_id,
          created_at: new Date().toISOString()
        },
        capture_result: captureResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error capturing PayPal payment:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Failed to process payment',
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// Helper function to send booking confirmation email
async function sendBookingConfirmationEmail(bookingData: any, booking: any, capture: any) {
  // Implement email service integration (e.g., SendGrid, Resend, etc.)
  // This is a placeholder for the actual email implementation
  console.log('Sending booking confirmation email to:', bookingData.customer_email)
  
  const emailData = {
    to: bookingData.customer_email,
    subject: 'Booking Confirmation - Karibu Safariz Tours',
    template: 'booking-confirmation',
    data: {
      customer_name: bookingData.customer_name,
      booking_id: booking.id,
      tour_date: bookingData.start_date,
      participants: bookingData.participants,
      total_amount: bookingData.total_amount,
      currency: bookingData.currency,
      payment_id: capture.id,
      booking_details: bookingData
    }
  }
  
  // Implement actual email sending logic here
  return Promise.resolve()
}

// Helper function to schedule post-service survey
async function schedulePostServiceSurvey(bookingId: string, tourDate: string) {
  // Calculate survey send date (e.g., 1 day after tour completion)
  const tourEndDate = new Date(tourDate)
  tourEndDate.setDate(tourEndDate.getDate() + 1)
  
  console.log('Scheduling post-service survey for booking:', bookingId, 'on:', tourEndDate)
  
  // Implement survey scheduling logic here
  // This could be done via a job queue, cron job, or scheduled function
  return Promise.resolve()
}