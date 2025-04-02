import Head from "next/head";
import styles from "../styles/Page.module.css";

// The Storyblok Client & hook
import Storyblok, { useStoryblok } from "../lib/storyblok";
import DynamicComponent from "../components/DynamicComponent";

export default function Home(props) {
  // the Storyblok hook to enable live updates
  const story = useStoryblok(props.story);

  return (
    <>
      <Head>
        <title>Ethan MacCumber</title>
      </Head>

      <header className={styles.header}>
        {story.content.page_header.map((blok) => (
          <DynamicComponent blok={blok} key={blok._uid} />
        ))}
      </header>
      <main className={styles.main}>
        {story
          ? story.content.body.map((blok) => (
              <DynamicComponent blok={blok} key={blok._uid} />
            ))
          : null}
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  let slug = "home";
  let params = {
    version: "draft", // or 'published'
    resolve_relations: "main_menu.reference",
  };

  if (context.preview) {
    params.version = "draft";
    params.cv = Date.now();
  }

  let { data } = await Storyblok.get(`cdn/stories/${slug}`, params);

  return {
    props: {
      story: data ? data.story : false,
      preview: context.preview || false,
    },
    revalidate: 10,
  };
}
