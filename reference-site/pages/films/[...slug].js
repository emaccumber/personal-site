import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/Page.module.css";
import stylesForVideoModal from "../../styles/VideoModal.module.css";
// The Storyblok Client & hook

import styles2 from "../../styles/SubMenu.module.css";

import Storyblok, { useStoryblok } from "../../lib/storyblok";
import PhotoSlider from "../../components/PhotoSlider";
import DynamicComponent from "../../components/DynamicComponent";
import SbEditable from "storyblok-react";

export default function DynamicVideosPage(props) {
  // the Storyblok hook to enable live updates
  const story = useStoryblok(props.story);
  const router = useRouter();
  const [currentIndexOfPhoto, setCurrentIndexOfPhoto] = useState(0);

  const album_type = props.story.content.component;
  let vimeoLink = false;
  let vimeoVideos = [];
  if (album_type == "video_album") {
    const allVimeoLinks = props.story.content.vimeo_links;
    allVimeoLinks.forEach((elem) =>
      vimeoVideos.push({ url: elem.url.url, title: "ㅤ" + elem.title, text: elem.text })
    );
  }
  vimeoVideos = vimeoVideos.filter((elem) => elem);
  const SubHeaders = props.videoList.stories?.map((elem) => {
    return {
      name: elem.name,
      url: elem.full_slug,
    };
  });
  if (props.story.full_slug.startsWith("videos/")) {
    console.log("This is a video album");
  }

  useEffect(() => {
    setCurrentIndexOfPhoto(0);
  }, [props]);

  return (
    <>
      <Head>
        <title>Ethan MacCumber</title>
      </Head>

      <header className={styles.header}>
        {story.content.page_header?.map((blok) => (
          <DynamicComponent blok={blok} key={blok._uid} />
        ))}
      </header>
      <div className={styles2.submenuContainer}>
        {SubHeaders.map((elem, index) => {
          let color = "#555";
          if (index == 0) {
            return null;
          }
          if (elem.url == props.story.full_slug) {
            color = "black";
          }

          return (
            <div
              className={styles2.submenuItems}
              style={{
                /*marginLeft: index === 0 ? `0px` : `15px`,*/ color: color,
              }}
              onClick={() => {
                router.push(`/${elem.url}`);
              }}
              key={`album-index-${index}`}
            >
              {elem.name}
            </div>
          );
        })}
      </div>

      <main className={styles.main}>
        <PhotoSlider
          type={"video"}
          album_list={props.videoList.stories}
          album_photos={
            album_type != "video_album"
              ? props.story.content.album_videos
              : vimeoVideos
          }
          sizeOfIndex={
            album_type != "video_album"
              ? props.story.content.album_videos.length
              : vimeoVideos.length
          }
          setIndex={setCurrentIndexOfPhoto}
          currIndex={currentIndexOfPhoto}
          album_type={album_type}
          vimeoVideos={vimeoVideos}
        />

        {props.story.content.body?.map((blok) => (
          <DynamicComponent blok={blok} key={blok._uid} />
        ))}
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  // we need to join the slug on catch all routes
  let slug = context.params.slug.join("/");
  let params = {
    version: "draft", // or 'published'
    resolve_relations: "main_menu.reference",
  };

  if (context.preview) {
    params.version = "draft";
    params.cv = Date.now();
  }

  let { data } = await Storyblok.get(`cdn/stories/films/${slug}`, params);
  let allVideos = await Storyblok.get("cdn/stories/", {
    starts_with: "films/",
  });
  return {
    props: {
      story: data ? data.story : false,
      preview: context.preview || false,
      videoList: allVideos ? allVideos.data : false,
    },
    revalidate: 10,
  };
}
export async function getStaticPaths() {
  // get all stories inside the pages folder
  let { data } = await Storyblok.get("cdn/links/");
  let paths = [];
  Object.keys(data.links).forEach((linkKey) => {
    // don't generate route for folders or home entry
    if (
      data.links[linkKey].is_folder ||
      data.links[linkKey].slug === "home" ||
      data.links[linkKey].slug === "header" ||
      data.links[linkKey].slug === "/header" ||
      data.links[linkKey].slug === "photographs/" ||
      data.links[linkKey].slug.startsWith("photographs") ||
      data.links[linkKey].slug.startsWith("/photographs") ||
      data.links[linkKey].slug === "films/" ||
      data.links[linkKey].slug === "films" ||
      data.links[linkKey].slug === "information"
    ) {
      return;
    }
    // get array for slug because of catch all
    const slug = data.links[linkKey].slug.split("/");
    const updatedArr = [];
    updatedArr.push(slug[1]);

    // generate page for the slug
    paths.push({ params: { slug: updatedArr } });
  });

  return {
    paths: paths,
    fallback: "blocking",
  };
}
