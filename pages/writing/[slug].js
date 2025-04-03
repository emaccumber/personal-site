import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Home.module.css';
import writingStyles from '@/styles/Writing.module.css';
import { getAllWritingPosts, getWritingPostBySlug } from '@/lib/api';

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

      <header className={styles.header}>
        <div className={styles.nameContainer}>
          <Link href="/" className={styles.name}>
            Ethan MacCumber
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/photographs" className={styles.navLink}>
            photographs
          </Link>
          <Link href="/films" className={styles.navLink}>
            films
          </Link>
          <Link href="/writing" className={`${styles.navLink} ${styles.active}`}>
            writing
          </Link>
          <Link href="/information" className={styles.navLink}>
            information
          </Link>
        </nav>
      </header>

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

          <div
            className={writingStyles.postContent}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      </main>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const post = getWritingPostBySlug(params.slug);
  
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
  const posts = getAllWritingPosts();
  
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug }
    })),
    fallback: false
  };
}