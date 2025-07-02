import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Header from '@/components/Header';
import { getInformationContent } from '@/lib/api';

export default function Information({ title, contentHtml }) {
  console.log('Rendering Information page with props:', { title, contentHtml });

  return (
    <div className={styles.container}>
      <Head>
        <title>Information | Ethan MacCumber</title>
        <meta name="description" content="About Ethan MacCumber - photographer and filmmaker. Learn about the artist and contact information." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Information | Ethan MacCumber" />
        <meta property="og:description" content="About Ethan MacCumber - photographer and filmmaker. Learn about the artist and contact information." />
        <meta property="og:url" content="https://ethanmaccumber.com/information" />
        <meta name="twitter:title" content="Information | Ethan MacCumber" />
        <meta name="twitter:description" content="About Ethan MacCumber - photographer and filmmaker. Learn about the artist and contact information." />
      </Head>

      <Header />

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
    const informationContent = getInformationContent();
    console.log('Received information content:', informationContent);

    // Explicitly check for returned data
    if (!informationContent) {
      console.error('No content returned from getInformationContent');
      return {
        props: {
          title: 'About Ethan MacCumber',
          contentHtml: 'Content could not be loaded.'
        }
      };
    }

    return {
      props: {
        title: informationContent.title || 'About Ethan MacCumber',
        contentHtml: informationContent.content || 'Content could not be loaded.'
      }
    };
  } catch (error) {
    console.error('Error in getStaticProps for information page:', error);
    return {
      props: {
        title: 'About Ethan MacCumber',
        contentHtml: 'An error occurred while loading the content.'
      }
    };
  }
}