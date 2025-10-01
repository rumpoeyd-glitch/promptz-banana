import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PromptCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  likesCount: number;
  onLikeUpdate: () => void;
}

const PromptCard = ({ id, title, imageUrl, category, likesCount, onLikeUpdate }: PromptCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLiking) return;

    setIsLiking(true);
    
    try {
      if (isLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("prompt_id", id);

        if (error) throw error;

        const { error: updateError } = await supabase
          .from("prompts")
          .update({ likes_count: likes - 1 })
          .eq("id", id);

        if (updateError) throw updateError;

        setIsLiked(false);
        setLikes(likes - 1);
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ prompt_id: id });

        if (error) throw error;

        const { error: updateError } = await supabase
          .from("prompts")
          .update({ likes_count: likes + 1 })
          .eq("id", id);

        if (updateError) throw updateError;

        setIsLiked(true);
        setLikes(likes + 1);
        toast.success("ถูกใจแล้ว!");
      }
      onLikeUpdate();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("ไม่สามารถอัปเดตไลค์ได้");
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Link to={`/prompt/${id}`}>
      <div className="group relative overflow-hidden rounded-xl bg-card border border-border transition-all hover:shadow-xl hover:-translate-y-1">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {category && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center rounded-full bg-accent/90 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-accent-foreground uppercase tracking-wide">
                {category}
              </span>
            </div>
          )}
          
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-sm font-medium transition-all hover:bg-white disabled:opacity-50"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-foreground"
              }`}
            />
            <span>{likes}</span>
          </button>
          
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PromptCard;
