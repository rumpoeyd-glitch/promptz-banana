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
    <section className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl bg-card border border-border p-8 shadow-sm transition-all hover:shadow-md">
          <div className="text-4xl font-bold mb-2">{stats?.promptsThisWeek || 0}+</div>
          <div className="text-sm text-muted-foreground">Prompts shared this week</div>
        </div>
        
        <div className="rounded-xl bg-card border border-border p-8 shadow-sm transition-all hover:shadow-md">
          <div className="text-4xl font-bold mb-2">{stats?.creators || 0}+</div>
          <div className="text-sm text-muted-foreground">Creators contributing</div>
        </div>
        
        <div className="rounded-xl bg-card border border-border p-8 shadow-sm transition-all hover:shadow-md">
          <div className="text-4xl font-bold mb-2">{stats?.totalLikes || 0}+</div>
          <div className="text-sm text-muted-foreground">Total likes given</div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
