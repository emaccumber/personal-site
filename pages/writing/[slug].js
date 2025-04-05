import Layout from '@/components/Layout';
import BackLink from '@/components/BackLink';
import styles from '@/styles/Writing.module.css';
import { getAllWritingPosts, getWritingPostBySlug } from '@/lib/api';

export default function Post({ post }) {
  if (!post) {
    return (
      <Layout title="Post Not Found" activeNav="writing">
        <div className={styles.postError}>Post not found</div>
      </Layout>
    );
  }

  return (
    <Layout
      title={post.title}
      description={post.excerpt || post.title}
      activeNav="writing"
    >
      <BackLink href="/writing" />

      <div className={styles.postContainer}>
        <article className={styles.post}>
          <header className={styles.postHeader}>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.postDate}>{post.date}</p>
          </header>

          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      </div>
    </Layout>
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