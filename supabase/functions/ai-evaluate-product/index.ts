// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

interface EvaluationRequest {
  productInfo: {
    category: string;
    brand: string;
    model: string;
    condition: string;
    specifications: Record<string, any>;
  };
  images: string[];
  questionsAnswers: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { productInfo, images, questionsAnswers } = await req.json() as EvaluationRequest
    
    // Get OpenAI API key from secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Create evaluation record
    const { data: evaluation, error: insertError } = await supabaseClient
      .from('ai_evaluations')
      .insert({
        user_id: user.id,
        product_info: productInfo,
        images,
        questions_answers: questionsAnswers,
        status: 'processing'
      })
      .select()
      .single()

    if (insertError) {
      throw new Error(`Failed to create evaluation: ${insertError.message}`)
    }

    // Prepare prompt for OpenAI
    const prompt = `You are an expert PC component evaluator. Analyze the following information and provide a detailed evaluation:

Product Category: ${productInfo.category}
Brand: ${productInfo.brand}
Model: ${productInfo.model}
Condition: ${productInfo.condition}
Specifications: ${JSON.stringify(productInfo.specifications, null, 2)}

User Q&A:
${Object.entries(questionsAnswers).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}

Based on this information, provide:
1. Estimated market value range (min-max USD)
2. Key factors affecting price
3. Condition assessment
4. Market demand analysis
5. Recommendations for selling
6. Confidence score (0-1)

Respond in JSON format with the following structure:
{
  "estimatedPrice": {
    "min": number,
    "max": number,
    "recommended": number
  },
  "confidenceScore": number,
  "conditionAssessment": string,
  "keyFactors": string[],
  "marketDemand": string,
  "recommendations": string[],
  "summary": string
}`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional PC hardware evaluator with extensive market knowledge. Provide accurate, detailed evaluations based on current market conditions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error('Failed to get AI evaluation')
    }

    const aiResult = await openaiResponse.json()
    const aiContent = aiResult.choices[0].message.content

    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiContent)
    } catch (e) {
      throw new Error('Failed to parse AI response')
    }

    // Update evaluation with results
    const { error: updateError } = await supabaseClient
      .from('ai_evaluations')
      .update({
        ai_response: parsedResponse,
        estimated_price: parsedResponse.estimatedPrice.recommended,
        confidence_score: parsedResponse.confidenceScore,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', evaluation.id)

    if (updateError) {
      throw new Error(`Failed to update evaluation: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        evaluationId: evaluation.id,
        result: parsedResponse 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in ai-evaluate-product:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})