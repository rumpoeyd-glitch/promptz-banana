-- เพิ่ม user_id ในตาราง likes เพื่อติดตามว่าใครกดไลค์
ALTER TABLE public.likes ADD COLUMN user_id TEXT NOT NULL DEFAULT 'anonymous';

-- สร้าง unique constraint เพื่อให้แต่ละคนกดไลค์ได้แค่ครั้งเดียวต่อ prompt
ALTER TABLE public.likes ADD CONSTRAINT unique_user_prompt_like UNIQUE(user_id, prompt_id);

-- ลบข้อมูลไลค์ที่ซ้ำกัน (ถ้ามี)
DELETE FROM public.likes a USING public.likes b
WHERE a.id < b.id AND a.prompt_id = b.prompt_id;

-- อัปเดต RLS policies ให้รองรับ anonymous users
DROP POLICY IF EXISTS "Anyone can delete likes" ON public.likes;
CREATE POLICY "Users can delete their own likes" ON public.likes
  FOR DELETE
  USING (true);

DROP POLICY IF EXISTS "Anyone can create likes" ON public.likes;  
CREATE POLICY "Users can create likes" ON public.likes
  FOR INSERT
  WITH CHECK (true);