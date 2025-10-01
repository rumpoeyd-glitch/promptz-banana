import React, { useState } from "react";
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

      toast.success("แชร์พรอมต์สำเร็จแล้ว!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting prompt:", error);
      toast.error("ไม่สามารถแชร์พรอมต์ได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-2xl py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">แชร์พรอมต์ของคุณ</h1>
          <p className="text-lg text-muted-foreground">
            อัปโหลดภาพ AI ของคุณและแชร์พรอมต์ที่สร้างมันขึ้นมา
            กับชุมชน
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">ชื่อเรื่อง *</Label>
            <Input
              id="title"
              required
              placeholder="ตั้งชื่อที่น่าสนใจให้กับผลงานของคุณ"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL รูปภาพ *</Label>
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
              อัปโหลดรูปภาพของคุณไปยังบริการเช่น Imgur หรือใช้ URL รูปภาพโดยตรง
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">พรอมต์ *</Label>
            <Textarea
              id="prompt"
              required
              rows={6}
              placeholder="แชร์พรอมต์ที่แท้จริงที่คุณใช้สร้างภาพนี้..."
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">หมวดหมู่ (ไม่บังคับ)</Label>
            <Input
              id="category"
              placeholder="เช่น แฟชั่นสตูดิโอ ภูมิทัศน์ บุคคล"
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
            {isSubmitting ? "กำลังแชร์..." : "แชร์พรอมต์"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Submit;
