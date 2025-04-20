"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { StarIcon } from "lucide-react";

interface FeedbackComponentProps {
  isOpen: boolean;
  onClose: () => void;
  aiResponse: string;
  modelType: string;
  assistantType: string;
  userMessage: string;
  onFeedbackSubmit: (rating: number, comments: string) => Promise<void>;
}


export function FeedbackComponent({
  isOpen,
  onClose,
  onFeedbackSubmit,
}: FeedbackComponentProps) {
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onFeedbackSubmit(rating, comments);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setComments("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this response</DialogTitle>
          <DialogDescription>
            How helpful was this AI response? Your feedback helps us improve.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}>
                <StarIcon
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Additional comments (optional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="min-h-24"
          />
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
