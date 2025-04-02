import { useRouter } from "next/router";
import React from "react";
import SbEditable from "storyblok-react";
import styles from "../styles/HeaderLink.module.css";

const Teaser = ({ blok }) => {
  const router = useRouter();
  const getCurrLocation = router.pathname;
  let styleClass = styles.menuLinkNotSelected;

  if (blok.link.url == "") {
    styleClass = styles.menuLinkTitle;
  } else if (getCurrLocation.startsWith(`/${blok.link.url}`)) {
    styleClass = styles.menuLinkSelected;
  } else {
    styleClass = styles.menuLinkNotSelected;
  }
  return (
    <SbEditable content={blok}>
      <a className={styleClass} href={"/" + blok.link.url}>
        {blok.text}
      </a>
    </SbEditable>
  );
};

export default Teaser;
