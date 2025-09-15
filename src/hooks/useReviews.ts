import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface CreateReviewRequest {
  product_id: string;
  rating: number;
  comment?: string;
}

export const useReviews = (productId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const { toast } = useToast();

  const fetchReviews = async (productId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:users(full_name, avatar_url)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      
      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(Number(avg.toFixed(1)));
        setTotalReviews(data.length);
      } else {
        setAverageRating(0);
        setTotalReviews(0);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: CreateReviewRequest) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to leave a review',
          variant: 'destructive',
        });
        return null;
      }

      // Check if user already reviewed this product
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', reviewData.product_id)
        .single();

      if (existingReview) {
        toast({
          title: 'Review already exists',
          description: 'You have already reviewed this product',
          variant: 'destructive',
        });
        return null;
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_id: reviewData.product_id,
          rating: reviewData.rating,
          comment: reviewData.comment || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Review submitted successfully',
      });

      // Refresh reviews
      if (productId) {
        fetchReviews(productId);
      }

      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit review',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateReview = async (reviewId: string, updates: Partial<CreateReviewRequest>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating: updates.rating,
          comment: updates.comment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Review updated successfully',
      });

      // Refresh reviews
      if (productId) {
        fetchReviews(productId);
      }

      return data;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update review',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });

      // Refresh reviews
      if (productId) {
        fetchReviews(productId);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);

  return {
    reviews,
    loading,
    averageRating,
    totalReviews,
    createReview,
    updateReview,
    deleteReview,
    refetch: () => productId && fetchReviews(productId),
  };
};