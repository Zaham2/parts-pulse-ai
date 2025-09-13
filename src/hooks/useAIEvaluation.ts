import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export interface EvaluationRequest {
  productInfo: {
    category: string
    brand: string
    model: string
    condition: string
    specifications: Record<string, any>
  }
  images: string[]
  questionsAnswers: Record<string, string>
}

export interface EvaluationResult {
  estimatedPrice: {
    min: number
    max: number
    recommended: number
  }
  confidenceScore: number
  conditionAssessment: string
  keyFactors: string[]
  marketDemand: string
  recommendations: string[]
  summary: string
}

export function useAIEvaluation() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const { toast } = useToast()

  const evaluateProduct = async (request: EvaluationRequest): Promise<EvaluationResult | null> => {
    try {
      setLoading(true)
      setResult(null)

      const { data, error } = await supabase.functions.invoke('ai-evaluate-product', {
        body: request
      })

      if (error) throw error

      if (data?.success && data?.result) {
        setResult(data.result)
        
        toast({
          title: "Evaluation completed!",
          description: "Your product has been successfully evaluated by AI.",
        })

        return data.result
      } else {
        throw new Error('Invalid response from AI evaluation service')
      }

    } catch (error: any) {
      console.error('Error evaluating product:', error)
      toast({
        title: "Evaluation failed",
        description: error.message || "Failed to evaluate your product. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const getEvaluationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_evaluations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error: any) {
      console.error('Error fetching evaluation history:', error)
      toast({
        title: "Error loading evaluations",
        description: error.message,
        variant: "destructive",
      })
      return []
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `evaluations/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
      return null
    }
  }

  return {
    loading,
    result,
    evaluateProduct,
    getEvaluationHistory,
    uploadImage,
  }
}