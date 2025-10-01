import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Submit = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    imageUrl: "",
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("prompts").insert({
        title: formData.title,
        prompt_text: formData.prompt,
        image_url: formData.imageUrl,
        category: formData.category || null,
      });

      if (error) throw error;

      toast.success("Prompt shared successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting prompt:", error);
      toast.error("Failed to share prompt");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-2xl py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Share Your Prompt</h1>
          <p className="text-lg text-muted-foreground">
            Upload your AI-generated image and share the prompt that created it
            with the community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              required
              placeholder="Give your creation a catchy title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL *</Label>
            <Input
              id="imageUrl"
              type="url"
              required
              placeholder="https://example.com/your-image.jpg"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
            <p className="text-sm text-muted-foreground">
              Upload your image to a service like Imgur or use a direct image URL
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt *</Label>
            <Textarea
              id="prompt"
              required
              rows={6}
              placeholder="Share the exact prompt you used to generate this image..."
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              placeholder="e.g., Studio Fashion, Landscape, Portrait"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
          >
            {isSubmitting ? "Sharing..." : "Share Prompt"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Submit;
