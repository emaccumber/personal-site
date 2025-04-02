import React from "react";
import SbEditable from "storyblok-react";
import styles from "../styles/Paragraph.module.css";

const Teaser = ({ blok }) => {
  return (
    <SbEditable content={blok}>
      <div className={styles.container}>
        <h3 className={styles.title}>{blok.title}</h3>
        <p className={styles.textDesc}>{blok.InfoBody}</p>
      </div>
    </SbEditable>
  );
};

export default Teaser;
