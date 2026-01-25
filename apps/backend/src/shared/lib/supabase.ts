import { createClient } from '@supabase/supabase-js';
import { config } from '../../config/index.js';

export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Generate a public URL for a file in Supabase Storage
 */
export function getPublicUrl(bucketName: string, filePath: string): string {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Generate a signed URL for private files (expires in 1 hour by default)
 */
export async function getSignedUrl(
  bucketName: string,
  filePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);
  
  if (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
  
  return data.signedUrl;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucketName: string,
  filePath: string,
  file: Buffer | File,
  options?: { contentType?: string; cacheControl?: string }
) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      contentType: options?.contentType,
      cacheControl: options?.cacheControl || '3600',
      upsert: false
    });
  
  if (error) throw error;
  return data;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucketName: string, filePath: string) {
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);
  
  if (error) throw error;
}

/**
 * List files in a bucket path
 */
export async function listFiles(bucketName: string, path: string = '') {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(path);
  
  if (error) throw error;
  return data;
}
