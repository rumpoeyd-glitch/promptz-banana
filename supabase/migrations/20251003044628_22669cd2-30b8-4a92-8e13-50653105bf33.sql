-- Create storage bucket for prompt images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'prompt-images',
  'prompt-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies for prompt images
CREATE POLICY "Anyone can view prompt images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'prompt-images');

CREATE POLICY "Anyone can upload prompt images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'prompt-images');

CREATE POLICY "Anyone can update their prompt images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'prompt-images');

CREATE POLICY "Anyone can delete prompt images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'prompt-images');

-- Add creator_name column to prompts table
ALTER TABLE public.prompts
ADD COLUMN creator_name text;

-- Update existing prompts to have a default creator name
UPDATE public.prompts
SET creator_name = 'ไม่ระบุชื่อ'
WHERE creator_name IS NULL;

-- Make creator_name required for new entries
ALTER TABLE public.prompts
ALTER COLUMN creator_name SET DEFAULT 'ไม่ระบุชื่อ';

-- Add policies for UPDATE and DELETE on prompts
CREATE POLICY "Allow updates via edge function"
ON public.prompts
FOR UPDATE
USING (true);

CREATE POLICY "Allow deletes via edge function"
ON public.prompts
FOR DELETE
USING (true);