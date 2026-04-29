-- 1. Create the table
-- If table already exists from dummy mode, we might need to add the FK constraint manually
-- or just drop and recreate if you don't mind losing test data.
-- To be safe, we use CREATE TABLE IF NOT EXISTS.
CREATE TABLE IF NOT EXISTS public.sales_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_name TEXT NOT NULL,
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  benefits JSONB NOT NULL,
  cta TEXT NOT NULL,
  price TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure user_id has the correct constraint if it was created in dummy mode without it
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'sales_pages_user_id_fkey' 
    AND table_name = 'sales_pages'
  ) THEN
    ALTER TABLE public.sales_pages 
    ADD CONSTRAINT sales_pages_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id);
  END IF;
END $$;

-- 2. Enable Row Level Security
ALTER TABLE public.sales_pages ENABLE ROW LEVEL SECURITY;

-- 3. Create policies (Idempotent version)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public read for sales pages" ON public.sales_pages;
    DROP POLICY IF EXISTS "Users can insert own sales pages" ON public.sales_pages;
    DROP POLICY IF EXISTS "Users can update own sales pages" ON public.sales_pages;
    DROP POLICY IF EXISTS "Users can delete own sales pages" ON public.sales_pages;
    DROP POLICY IF EXISTS "Allow public insert for dev" ON public.sales_pages;
END $$;

-- Allow anyone to read for preview purposes if they have the ID
CREATE POLICY "Allow public read for sales pages" 
  ON public.sales_pages FOR SELECT 
  USING (true);

-- Allow users to manage their own pages
CREATE POLICY "Users can insert own sales pages" 
  ON public.sales_pages FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sales pages" 
  ON public.sales_pages FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sales pages" 
  ON public.sales_pages FOR DELETE 
  USING (auth.uid() = user_id);
