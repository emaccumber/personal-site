import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { informationDirectory } from './config';

/**
 * Get information page content
 * @returns {Object} Information page content
 */
export function getInformationContent() {
  try {
    // Create information directory if it doesn't exist
    if (!fs.existsSync(informationDirectory)) {
      fs.mkdirSync(informationDirectory, { recursive: true });
    }

    const filePath = path.join(informationDirectory, 'about.md');
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      // Return default content if the file doesn't exist
      return {
        title: 'About Ethan MacCumber',
        content: 'Information page content not found.',
        contentHtml: '<p>Information page content not found.</p>'
      };
    }

    // Read markdown file
    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Parse markdown front matter and content
    const { data, content } = matter(fileContents);

    // Process markdown content to HTML
    const processedContent = remark()
      .use(html)
      .processSync(content)
      .toString();
    
    // Return the information content
    return {
      title: data.title || 'About Ethan MacCumber',
      content,
      contentHtml: processedContent
    };
  } catch (error) {
    console.error('Error loading information content:', error);
    
    // Return default content in case of error
    return {
      title: 'About Ethan MacCumber',
      content: 'Error loading information content.',
      contentHtml: '<p>Error loading information content.</p>'
    };
  }
}
