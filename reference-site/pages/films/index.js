import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Page.module.css";
// The Storyblok Client & hook
import Storyblok, { useStoryblok } from "../../lib/storyblok";
import DynamicComponent from "../../components/DynamicComponent";

import ReactPlayer from "react-player";
import SbEditable from "storyblok-react";

export default function Films(props) {
  // the Storyblok hook to enable live updates

  const router = useRouter();
  const story = useStoryblok(props.albums.stories[0]);
  const albums = props.albums.stories.slice(1);
  const [shouldPlay, setShouldPlay] = useState({});
  useEffect(() => {
    const shouldPlayObj = {};
    albums.forEach((elem, index) => {
      shouldPlayObj[index] = false;
    });
    setShouldPlay({ ...shouldPlayObj });
  }, []);
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
        <div className={styles.PhotographPage}>
          <div className={styles.albumsContainer}>
            {albums
              ? albums.map((album, index) => {
                  const file_type =
                    album.content.thumbnail_video_or_image.filename.toUpperCase();
                  var checkIfImageIsPNG = file_type.endsWith(".PNG");
                  var checkIfImageIsJPG = file_type.endsWith(".JPG");
                  var checkIfImageIsSVG = file_type.endsWith(".SVG");
                  var checkIfImageIsGIF = file_type.endsWith(".GIF");
                  var checkIfImageIsTIFF = file_type.endsWith(".TIFF");
                  let isImage = false;
                  if (
                    checkIfImageIsJPG ||
                    checkIfImageIsPNG ||
                    checkIfImageIsSVG ||
                    checkIfImageIsTIFF ||
                    checkIfImageIsGIF
                  ) {
                    isImage = true;
                  }

                  return (
                    <SbEditable content={album.content} key={index}>
                      <div className={styles.photoAlbum}>
                        <a href={`/${album.full_slug}`}>
                          {isImage ? (
                            <img
                              src={
                                album.content.thumbnail_video_or_image.filename
                              }
                            />
                          ) : (
                            <div
                              style={{
                                marginBottom: "7px",
                                maxWidth: "100%",
                                height: "150px",
                              }}
                              onMouseEnter={(e) => {
                                setShouldPlay({
                                  ...shouldPlay,
                                  [index]: true,
                                });
                              }}
                              onMouseLeave={(e) => {
                                setShouldPlay({
                                  ...shouldPlay,
                                  [index]: false,
                                });
                              }}
                            >
                              <ReactPlayer
                                url={
                                  album.content.thumbnail_video_or_image.filename
                                }
                                show
                                width="100%"
                                height="170px"
                                controls={false}
                                muted={true}
                                playing={shouldPlay[index]}
                                autoPlay
                                loop={false}
                              />
                            </div>
                          )}
                        </a>
                        <a href={`/${album.full_slug}`}>{album.name}</a>
                      </div>
                    </SbEditable>
                  );
                })
              : null}
          </div>
        </div>
        {/* {story
          ? story.content.body.map((blok) => (
              <DynamicComponent blok={blok} key={blok._uid} />
            ))
          : null} */}
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
    starts_with: "films/",
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
