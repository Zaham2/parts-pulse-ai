import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '12')
    const category = url.searchParams.get('category')
    const condition = url.searchParams.get('condition')
    const minPrice = url.searchParams.get('minPrice')
    const maxPrice = url.searchParams.get('maxPrice')
    const search = url.searchParams.get('search')
    const sortBy = url.searchParams.get('sortBy') || 'created_at'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    let query = supabaseClient
      .from('products')
      .select(`
        *,
        seller:users!products_seller_id_fkey(id, full_name, avatar_url)
      `)
      .eq('is_available', true)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    if (condition) {
      query = query.eq('condition', condition)
    }
    
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }
    
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Get total count for pagination
    const { count } = await supabaseClient
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_available', true)

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: products, error } = await query

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return new Response(
      JSON.stringify({
        products,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in get-products:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})