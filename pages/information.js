import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import { getInformationContent } from '@/lib/api';

export default function Information({ title, contentHtml }) {
  console.log('Rendering Information page with props:', { title, contentHtml });
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Information | Ethan MacCumber</title>
        <meta name="description" content="About Ethan MacCumber" />
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
          <Link href="/writing" className={styles.navLink}>
            writing
          </Link>
          <Link href="/information" className={`${styles.navLink} ${styles.active}`}>
            information
          </Link>
        </nav>
      </header>

      <main className={styles.contentContainer}>
        <div className={styles.bioContainer}>
          <h1 className={styles.bioTitle}>{title}</h1>
          <div 
            className={styles.bioContent}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </main>
    </div>
  );
}

export function getStaticProps() {
  try {
    console.log('Fetching information content...');
    // Remove await since we changed getInformationContent to be synchronous
    const informationContent = getInformationContent();
    console.log('Received information content:', informationContent);
    
    // Explicitly check for returned data
    if (!informationContent) {
      console.error('No content returned from getInformationContent');
      return {
        props: {
          title: 'About Ethan MacCumber',
          contentHtml: '<p>Content could not be loaded.</p>'
        }
      };
    }
    
    return {
      props: {
        title: informationContent.title || 'About Ethan MacCumber',
        contentHtml: informationContent.contentHtml || '<p>Content could not be loaded.</p>'
      }
    };
  } catch (error) {
    console.error('Error in getStaticProps for information page:', error);
    return {
      props: {
        title: 'About Ethan MacCumber',
        contentHtml: '<p>An error occurred while loading the content.</p>'
      }
    };
  }
}