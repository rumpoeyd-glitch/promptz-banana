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
          <h2 className="text-2xl font-bold mb-4">ยังไม่มีพรอมต์</h2>
          <p className="text-muted-foreground">เป็นคนแรกที่แชร์ผลงาน AI ของคุณ!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">
          ดูสิ่งที่ชุมชนกำลังสร้างสรรค์และชื่นชอบในตอนนี้
        </h2>
        <p className="text-muted-foreground">
          ทุกภาพมาพร้อมกับพรอมต์ที่แท้จริงที่สร้างมันขึ้นมา ข้ามการเดาเอา
          และเรียนรู้โดยตรงจากผลงานที่ดึงดูดความสนใจของชุมชน
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
