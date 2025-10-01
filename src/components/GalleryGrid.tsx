import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PromptCard from "./PromptCard";

const GalleryGrid = () => {
  const { data: prompts, refetch } = useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!prompts || prompts.length === 0) {
    return (
      <section className="container py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No prompts yet</h2>
          <p className="text-muted-foreground">Be the first to share your AI creations!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          See what the community is creating and loving right now.
        </h2>
        <p className="text-muted-foreground">
          Every image comes with the exact prompt that created it. Skip the guesswork
          and learn directly from pieces that caught the community's attention.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            id={prompt.id}
            title={prompt.title}
            imageUrl={prompt.image_url}
            category={prompt.category}
            likesCount={prompt.likes_count}
            onLikeUpdate={() => refetch()}
          />
        ))}
      </div>
    </section>
  );
};

export default GalleryGrid;
