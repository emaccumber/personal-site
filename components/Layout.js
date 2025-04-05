import Head from 'next/head';
import Header from './Header';
import styles from '@/styles/Layout.module.css';

export default function Layout({ children, title, description, activeNav }) {
  const fullTitle = title ? `${title} | Ethan MacCumber` : 'Ethan MacCumber';
  const metaDescription = description || 'Photography and films by Ethan MacCumber';

  return (
    <div className={styles.container}>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header activeNav={activeNav} />

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
