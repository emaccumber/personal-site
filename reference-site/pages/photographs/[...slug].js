import { useState } from "react";
import Head from "next/head";
import styles from "../../styles/Page.module.css";

import styles2 from "../../styles/SubMenu.module.css";

import { useRouter } from "next/router";
// The Storyblok Client & hook
import Storyblok, { useStoryblok } from "../../lib/storyblok";
import DynamicComponent from "../../components/DynamicComponent";
import PhotoSlider from "../../components/PhotoSlider";

export default function DynamicPage(props) {
  // the Storyblok hook to enable live updates
  const story = useStoryblok(props.story);
  const router = useRouter();
  const [currentIndexOfPhoto, setCurrentIndexOfPhoto] = useState(0);
  const SubHeaders = props.imageList?.stories.map((elem) => {
    return {
      name: elem.name,
      url: elem.full_slug,
    };
  });

  if (props.story.full_slug.startsWith("photographs/")) {
    console.log("This is a photo album");
  }

  return (
    <>
      <Head>
        <title>Ethan MacCumber</title>
      </Head>

      <header className={styles.header}>
        {props.story.content.page_header?.map((blok) => (
          <DynamicComponent blok={blok} key={blok._uid} />
        ))}
      </header>
      <div className={styles2.submenuContainer}>
        {SubHeaders.map((elem, index) => {
          if (index == 0) {
            return null;
          }
          let color = "#555";
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
          name={props.story.name}
          type={"image"}
          album_list={props.imageList.stories}
          album_photos={props.story.content.album_photos}
          setIndex={setCurrentIndexOfPhoto}
          sizeOfIndex={props.story.content.album_photos.length}
          currIndex={currentIndexOfPhoto}
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

  let { data } = await Storyblok.get(`cdn/stories/photographs/${slug}`, params);
  let allImages = await Storyblok.get("cdn/stories/", {
    starts_with: "photographs/",
  });
  return {
    props: {
      story: data ? data.story : false,
      preview: context.preview || false,
      imageList: allImages ? allImages.data : false,
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
      data.links[linkKey].slug.startsWith("films") ||
      data.links[linkKey].slug.startsWith("/films") ||
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
