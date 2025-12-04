
  # Create storage buckets for file uploads

  1. Storage Buckets
    - `enquiry-images` - For contact form image uploads
    - `gallery-images` - For gallery artwork uploads

  2. Security
    - Public read access for both buckets
    - Authenticated upload access


-- Create enquiry images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('enquiry-images', 'enquiry-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create gallery images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for enquiry-images bucket
CREATE POLICY "Public read access for enquiry images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'enquiry-images');

CREATE POLICY "Authenticated upload for enquiry images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'enquiry-images');

-- Policies for gallery-images bucket
CREATE POLICY "Public read access for gallery images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated upload for gallery images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery-images');

CREATE POLICY "Users can delete own gallery images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery-images' AND auth.uid()::text = (storage.foldername(name))[1]);