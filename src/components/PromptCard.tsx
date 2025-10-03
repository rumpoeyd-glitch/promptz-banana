import React, { useState } from "react";
import { Heart, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PromptCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  likesCount: number;
  creatorName?: string;
  promptText: string;
  onLikeUpdate: () => void;
}

const PromptCard = ({ id, title, imageUrl, category, likesCount, creatorName, promptText, onLikeUpdate }: PromptCardProps) => {
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

  const handleCopyPrompt = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(promptText);
      toast.success("คัดลอกพรอมต์แล้ว!");
    } catch (error) {
      console.error("Error copying prompt:", error);
      toast.error("ไม่สามารถคัดลอกพรอมต์ได้");
    }
  };

  return (
    <Link to={`/prompt/${id}`}>
      <div className="group relative overflow-hidden rounded-lg bg-card border transition-all hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/40">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {category && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center rounded-full bg-primary/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary-foreground">
                {category}
              </span>
            </div>
          )}
          
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:scale-105 disabled:opacity-50"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-foreground"
              }`}
            />
            <span className="text-foreground">{likes}</span>
          </button>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
            <h3 className="text-base font-semibold text-white line-clamp-2">
              {title}
            </h3>
            
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 rounded-md bg-white/95 backdrop-blur-sm px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:scale-105"
              >
                <Copy className="h-3.5 w-3.5 text-foreground" />
                <span className="text-foreground">Copy prompt</span>
              </button>
              
              {creatorName && (
                <span className="text-xs text-white/90 font-medium">
                  by @{creatorName}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PromptCard;
