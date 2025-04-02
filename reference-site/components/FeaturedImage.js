import React from 'react'
import SbEditable from 'storyblok-react'
import styles from '../styles/FeaturedImage.module.css'

const Teaser = ({blok}) => {
  if (!blok.image.filename.endsWith(".mp4")) {
    return (
      <SbEditable content={blok}>
        <img className={styles.featuredImage} src={blok.image.filename} alt={blok.image.alt}/>
      </SbEditable>
    );
  } else {
    return (
      <SbEditable content={blok}>
        <video
          className={styles.featuredImage}
          src="https://a.storyblok.com/f/113170/x/93fc88e16c/calm-waterfall-test.mp4"
          alt={blok.image.alt}
          onMouseOver={(event) => {
            if (window.innerWidth > 800)
              event.target.play()
          }}
          onMouseOut={event => event.target.pause()}
          muted
          playsinline
        />
      </SbEditable>
    );
  }
}

export default Teaser
