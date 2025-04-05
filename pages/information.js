import Layout from '@/components/Layout';
import styles from '@/styles/Content.module.css';
import { getInformationContent } from '@/lib/api';

export default function Information({ title, contentHtml }) {
  return (
    <Layout
      title="Information"
      description="About Ethan MacCumber"
      activeNav="information"
    >
      <div className={styles.contentContainer}>
        <div className={styles.contentWrapper}>
          <h1 className={styles.contentTitle}>{title}</h1>
          <div
            className={styles.contentBody}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>
      </div>
    </Layout>
  );
}

export function getStaticProps() {
  try {
    const informationContent = getInformationContent();

    if (!informationContent) {
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