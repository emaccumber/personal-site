import Layout from '@/components/Layout'
import styles from '@/styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
      <div className={styles.featuredImageContainer}>
        <img
          src="/images/featured.jpg"
          alt="Featured photograph"
          className={styles.featuredImage}
        />
      </div>
    </Layout>
  )
}