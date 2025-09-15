import React, { useState } from 'react';
import { Star, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Review, useReviews } from '@/hooks/useReviews';
import { ReviewForm } from './ReviewForm';
import { supabase } from '@/lib/supabase';

interface ReviewCardProps {
  review: Review;
  currentUserId?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteReview } = useReviews();

  const isOwner = currentUserId === review.user_id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(review.id);
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <ReviewForm
        productId={review.product_id}
        existingReview={review}
        onComplete={handleEditComplete}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.user?.avatar_url || ''} />
            <AvatarFallback>
              {review.user?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">
                  {review.user?.full_name || 'Anonymous'}
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
            
            {review.comment && (
              <p className="text-foreground">{review.comment}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};