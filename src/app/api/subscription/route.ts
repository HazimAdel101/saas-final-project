import { NextResponse } from 'next/server'
import { subscriptionSchema } from '@/features/subscription/utils/subscription-schema'

export async function POST(request: Request) {
  try {
    console.log('Received subscription request')
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate the request body against our schema
    const validatedData = subscriptionSchema.parse(body)
    console.log('Validated data:', validatedData)
    
    // Prepare the data for the webhook
    const webhookData = {
      start_date: validatedData.start_date,
      end_date: validatedData.end_date,
      subscription_email: validatedData.subscription_email,
      service_id: validatedData.service_id,
      ...(validatedData.customer_name && { customer_name: validatedData.customer_name }),
      ...(validatedData.subscription_price && { subscription_price: validatedData.subscription_price }),
      ...(validatedData.client_mail && { client_mail: validatedData.client_mail }),
      ...(validatedData.phone_number && { phone_number: validatedData.phone_number }),
      ...(validatedData.notes && { notes: validatedData.notes })
    }

    console.log('Sending to webhook:', webhookData)

    // Send data to the webhook from the server (no CORS issues)
    const webhookResponse = await fetch('https://n8n.marevo.info/webhook/new-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    })

    console.log('Webhook response status:', webhookResponse.status)
    console.log('Webhook response headers:', Object.fromEntries(webhookResponse.headers.entries()))

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error('Webhook error response:', errorText)
      
      // Handle specific webhook errors
      if (webhookResponse.status === 404) {
        throw new Error(`Webhook not found. Please check if the webhook URL is correct and the n8n workflow is active. Status: ${webhookResponse.status}`)
      }
      
      throw new Error(`Webhook request failed with status: ${webhookResponse.status} - ${errorText}`)
    }

    // Try to parse JSON response, but handle cases where it might not be JSON
    let webhookResult
    try {
      const responseText = await webhookResponse.text()
      console.log('Webhook response text:', responseText)
      
      if (responseText) {
        webhookResult = JSON.parse(responseText)
      } else {
        webhookResult = { message: 'Webhook responded successfully' }
      }
    } catch (parseError) {
      console.log('Webhook response is not JSON, treating as success')
      webhookResult = { message: 'Webhook responded successfully' }
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Subscription created successfully',
        data: webhookResult 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error('Subscription creation error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: error.message 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create subscription', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
