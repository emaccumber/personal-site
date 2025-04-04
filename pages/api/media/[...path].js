import { getFileUrl } from '@/lib/backblaze';

export default async function handler(req, res) {
  // Get the file path from the URL
  const { path } = req.query;
  
  // Construct the file path
  const filePath = Array.isArray(path) ? path.join('/') : path;
  
  try {
    // Get the authorized download URL
    const url = await getFileUrl(filePath);
    
    // Redirect to the authorized URL
    res.redirect(url);
  } catch (error) {
    console.error('Error serving media file:', error);
    res.status(404).json({ error: 'File not found' });
  }
}