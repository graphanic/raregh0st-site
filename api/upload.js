import { handleUpload } from '@vercel/blob/client';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(request) {
  try {
    const jsonResponse = await handleUpload({
      request,
      onBeforeGenerateToken: async (pathname) => {
        // You can add authentication/validation here
        console.log('[v0] Generating token for:', pathname);
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('[v0] Upload completed:', blob.url);
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[v0] Upload error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
