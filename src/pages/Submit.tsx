import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const Submit = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    prompt: "",
    category: "",
    creatorName: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5242880) {
        toast.error("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error("กรุณาเลือกภาพ");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('prompt-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('prompt-images')
        .getPublicUrl(filePath);

      // Insert prompt
      const { error } = await supabase.from("prompts").insert({
        title: formData.title,
        prompt_text: formData.prompt,
        image_url: publicUrl,
        category: formData.category || null,
        creator_name: formData.creatorName || 'ไม่ระบุชื่อ',
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
            <Label htmlFor="creatorName">ชื่อผู้สร้าง</Label>
            <Input
              id="creatorName"
              placeholder="ระบุชื่อของคุณ (ไม่บังคับ)"
              value={formData.creatorName}
              onChange={(e) =>
                setFormData({ ...formData, creatorName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">รูปภาพ *</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">คลิกเพื่ออัปโหลด</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP หรือ GIF (สูงสุด 5MB)
                  </p>
                </div>
                <Input
                  id="image"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  required
                />
              </label>
            )}
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
