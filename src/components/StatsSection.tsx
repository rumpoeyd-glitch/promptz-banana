import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StatsSection = () => {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data: prompts } = await supabase
        .from("prompts")
        .select("created_at, likes_count");
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const promptsThisWeek = prompts?.filter(
        (p) => new Date(p.created_at) > weekAgo
      ).length || 0;
      
      const totalLikes = prompts?.reduce((sum, p) => sum + p.likes_count, 0) || 0;
      
      return {
        promptsThisWeek,
        creators: prompts?.length || 0,
        totalLikes,
      };
    },
  });

  return (
    <section className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-card border p-6 hover:border-primary/50 transition-colors">
          <div className="text-3xl font-semibold mb-1">{stats?.promptsThisWeek || 0}+</div>
          <div className="text-sm text-muted-foreground font-light">พรอมต์ที่แชร์ในสัปดาห์นี้</div>
        </div>
        
        <div className="rounded-lg bg-card border p-6 hover:border-primary/50 transition-colors">
          <div className="text-3xl font-semibold mb-1">{stats?.creators || 0}+</div>
          <div className="text-sm text-muted-foreground font-light">ผู้สร้างสรรค์ที่เข้าร่วม</div>
        </div>
        
        <div className="rounded-lg bg-card border p-6 hover:border-primary/50 transition-colors">
          <div className="text-3xl font-semibold mb-1">{stats?.totalLikes || 0}+</div>
          <div className="text-sm text-muted-foreground font-light">ยอดไลค์ทั้งหมด</div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
