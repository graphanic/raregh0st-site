import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
          ],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Upload completed:', blob.url);
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
