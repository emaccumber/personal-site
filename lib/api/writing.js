import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { writingDirectory } from './config';

/**
 * Get all writing posts
 * @returns {Array} Array of writing post objects
 */
export function getAllWritingPosts() {
  try {
    // Check if the directory exists
    if (!fs.existsSync(writingDirectory)) {
      fs.mkdirSync(writingDirectory, { recursive: true });
      return [];
    }

    // Get all markdown files
    const fileNames = fs.readdirSync(writingDirectory);
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(writingDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Parse markdown front matter
        const { data, content } = matter(fileContents);

        // Return post data with slug
        return {
          slug,
          title: data.title,
          date: data.date,
          excerpt: data.excerpt || '',
          content
        };
      });

    return posts;
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
}

/**
 * Get a specific writing post by slug
 * @param {string} slug - The post slug
 * @returns {Object|null} The post object or null if not found
 */
export function getWritingPostBySlug(slug) {
  try {
    // Create content directory if it doesn't exist
    if (!fs.existsSync(writingDirectory)) {
      fs.mkdirSync(writingDirectory, { recursive: true });
    }

    const fullPath = path.join(writingDirectory, `${slug}.md`);

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      console.error(`Writing post file not found for slug: ${slug}`);
      return null;
    }

    // Read markdown file
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Parse markdown front matter and content
    const { data, content } = matter(fileContents);

    // Process markdown content to HTML
    const processedContent = remark()
      .use(html)
      .processSync(content)
      .toString();

    // Return post data with HTML content
    return {
      slug,
      title: data.title,
      date: data.date,
      content,
      contentHtml: processedContent
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}
