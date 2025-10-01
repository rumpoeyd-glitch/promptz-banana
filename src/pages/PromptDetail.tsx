import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PromptDetail = () => {
  const { id } = useParams();

  const { data: prompt, isLoading } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const copyPrompt = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.prompt_text);
      toast.success("Prompt copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Prompt not found</h2>
          <Link to="/">
            <Button variant="outline">Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-6xl py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={prompt.image_url}
              alt={prompt.title}
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            {prompt.category && (
              <span className="inline-flex items-center rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent-foreground uppercase tracking-wide">
                {prompt.category}
              </span>
            )}

            <h1 className="text-4xl font-bold">{prompt.title}</h1>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>{prompt.likes_count} likes</span>
              </div>
              <span>•</span>
              <span>{new Date(prompt.created_at).toLocaleDateString()}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Prompt</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPrompt}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
              
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {prompt.prompt_text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PromptDetail;
