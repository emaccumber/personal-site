import fs from 'fs'
import path from 'path'
import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'

const writingDirectory = path.join(process.cwd(), '_content/writing')

export interface WritingPost {
  slug: string
  title: string
  date: string
  excerpt: string
  content: any // Serialized MDX content
}

export async function getWritingPosts(): Promise<Omit<WritingPost, 'content'>[]> {
  const fileNames = fs.readdirSync(writingDirectory)
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(writingDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        
        const { data: frontmatter } = matter(fileContents)

        return {
          slug,
          title: frontmatter.title,
          date: frontmatter.date,
          excerpt: frontmatter.excerpt,
        }
      })
  )

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getWritingPostBySlug(slug: string): Promise<WritingPost | null> {
  const fullPath = path.join(writingDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data: frontmatter, content } = matter(fileContents)
  
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  })

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    excerpt: frontmatter.excerpt,
    content: mdxSource,
  }
}

export async function getAllWritingSlugs(): Promise<string[]> {
  const fileNames = fs.readdirSync(writingDirectory)
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''))
}