import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export interface Product {
  id: string
  seller_id: string
  title: string
  description: string | null
  category: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case' | 'cooling' | 'other'
  brand: string | null
  model: string | null
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
  price: number
  original_price: number | null
  specifications: any
  images: string[]
  is_available: boolean
  views_count: number
  created_at: string
  updated_at: string
  seller?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
}

export interface ProductFilters {
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

export function useProducts(filters: ProductFilters = {}, page: number = 1, limit: number = 12) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.category && { category: filters.category }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
        ...(filters.search && { search: filters.search }),
      })

      const { data, error } = await supabase.functions.invoke('get-products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (error) throw error

      setProducts(data.products || [])
      setPagination(data.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      })

    } catch (error: any) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters, page, limit])

  const incrementViews = async (productId: string) => {
    try {
      const { error } = await supabase.rpc('increment_product_views', {
        product_uuid: productId
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Error incrementing views:', error)
    }
  }

  const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'seller'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Product created successfully!",
        description: "Your product has been listed for sale.",
      })

      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      })
      return { data: null, error }
    }
  }

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Product updated successfully!",
        description: "Your changes have been saved.",
      })

      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      })
      return { data: null, error }
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      toast({
        title: "Product deleted successfully!",
        description: "The product has been removed from your listings.",
      })

      return { error: null }
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    }
  }

  return {
    products,
    loading,
    pagination,
    refetch: fetchProducts,
    incrementViews,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}