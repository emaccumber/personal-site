import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MDXRemote } from 'next-mdx-remote';
import styles from '@/styles/Home.module.css';
import writingStyles from '@/styles/Writing.module.css';
import Header from '@/components/Header';
import AltairChart from '@/components/AltairChart';
import { getWritingPostBySlug, getAllWritingSlugs } from '@/lib/mdx';

const components = {
  AltairChart,
};

export default function Post({ post }) {
  const router = useRouter();

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.title} | Ethan MacCumber</title>
        <meta name="description" content={post.excerpt || post.title} />
      </Head>

      <Header />

      <div className={styles.backToAlbums}>
        <Link href="/writing">
          &lt;&lt;&lt;
        </Link>
      </div>

      <main className={writingStyles.postContainer}>
        <article className={writingStyles.post}>
          <header className={writingStyles.postHeader}>
            <h1 className={writingStyles.postTitle}>{post.title}</h1>
            <p className={writingStyles.postDate}>{post.date}</p>
          </header>

          <div className={writingStyles.postContent}>
            <MDXRemote {...post.content} components={components} />
          </div>
        </article>
      </main>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const post = await getWritingPostBySlug(params.slug);
  
  if (!post) {
    return {
      notFound: true
    };
  }
  
  return {
    props: { post }
  };
}

export async function getStaticPaths() {
  const slugs = await getAllWritingSlugs();
  
  return {
    paths: slugs.map((slug) => ({
      params: { slug }
    })),
    fallback: false
  };
}