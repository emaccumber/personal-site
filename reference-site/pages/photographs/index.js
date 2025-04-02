import Head from "next/head";
import styles from "../../styles/Page.module.css";
// The Storyblok Client & hook
import Storyblok, { useStoryblok } from "../../lib/storyblok";
import DynamicComponent from "../../components/DynamicComponent";
import SbEditable from "storyblok-react";

export default function Photographs(props) {
  // the Storyblok hook to enable live updates
  const story = useStoryblok(props.albums.stories[0]);
  const albums = props.albums.stories.slice(1);

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

      <main className={styles.albumsMain}>
        <div
          className={styles.PhotographPage}
          /*style={{ marginRight: albums.length > 2 ? "15px" : "270px" }}*/
        >
          <div className={styles.albumsContainer}>
            {albums
              ? albums.map((album, index) => (
                  <SbEditable content={album.content} key={index}>
                    <div className={styles.photoAlbum}>
                      <a href={album.full_slug}>
                        <img
                          src={album.content.album_featured_photo.filename}
                        />
                      </a>
                      <a href={album.full_slug}>
                        {album.name}
                      </a>
                    </div>
                  </SbEditable>
                ))
              : null}
          </div>
        </div>

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
  let params = {
    version: "draft", // or 'published'
    resolve_relations: "main_menu.reference",
  };

  if (context.preview) {
    params.version = "draft";
    params.cv = Date.now();
  }

  //let { data } = await Storyblok.get(`cdn/stories/photographs/`, params)

  let { data } = await Storyblok.get(`cdn/stories/`, {
    version: "draft", // or 'published'
    starts_with: "photographs/",
    resolve_relations: "main_menu.reference",
  });

  return {
    props: {
      //story: data ? data.story : false,
      albums: data ? data : false,
      preview: context.preview || false,
    },
    revalidate: 10,
  };
}
