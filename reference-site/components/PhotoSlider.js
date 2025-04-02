import styles from "../styles/PhotoSlider.module.css";
import React, { useState, useEffect, useRef, createRef } from "react";
import { render } from 'storyblok-rich-text-react-renderer';
import ReactPlayer from "react-player";
import { useRouter } from 'next/router'

const PhotoSlider = (props) => {
  const router = useRouter();

  const [albumName, setAlbumName] = useState();

  const [shouldPlay, setShouldPlay] = useState(false);
  const [nextTimeToUpdate, setNextTimeToUpdate] = useState(
    new Date().getTime()
  );
  const videoRef = useRef(props.album_photos.map(() => createRef()));
  const handleIncreaseSlider = async () => {
    if (props.currIndex >= props.sizeOfIndex - 1) {
      router.push("/" + window.location.pathname.split("/")[1])
    } else {
      props.setIndex(props.currIndex + 1);
    }
  };
  const handleDecreaseSlider = async () => {
    if (props.currIndex <= 0) {
      props.setIndex(props.sizeOfIndex - 1);
    } else {
      props.setIndex(props.currIndex - 1);
    }
  };

  const componentToShowForVideoPlayer = () => {
    if (props.album_type === "moving-images-album") {
      return (
        <div
          style={{
            marginTop: "25px",
            cursor: "pointer",
            textAlign: "center",
          }}
          onClick={() => {
            setShouldPlay((elem) => !elem);
          }}
        >
          {!shouldPlay ? (
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 12.3301L9 16.6603L9 8L15 12.3301Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 7H8V17H11V7Z" fill="currentColor" />
              <path d="M13 17H16V7H13V17Z" fill="currentColor" />
            </svg>
          )}
        </div>
      );
    } else if (props.album_type === "video_album") {
      return (
        <div
          style={{
            marginTop: "25px",
            cursor: "pointer",
            textAlign: "center",
          }}
        ></div>
      );
    }
  };

  useEffect(() => {
    setShouldPlay(true);
    setShouldPlay(false);

    if (props.name != albumName) {
      setAlbumName(props.name);
      props.setIndex(0);
    }
  }, [props]);
  return (
    <>
      <div className={`${styles.photoSlider} ${props.type == "image" ? styles.image : ''}`} style={{ height: "100%" }}>
        {props.album_photos?.map((photo, index) => {
          return (
            <div
              className={styles.slide}
              key={`video-player-content-main-${index}`}
              style={{ display: props.currIndex == index ? "flex" : "none" }}
            >
              {props.type == "image" ? (
                <>
                  <img
                    src={photo.image.filename}
                    alt={photo.image.alt}
                    onClick={handleIncreaseSlider}
                  />
                  <p
                    style={{
                      marginTop: "5px",
                      marginBottom: "0",
                      textAlign: "right",
                      fontSize: "10.83px",
                      color: "#555",
                    }}
                  >
                    ㅤ{photo.image.title}
                  </p>

                  <div className={styles.textContainer} style={{display: 'flex', justifyContent: 'center', left: '0', width: '100%'}}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        marginTop: '-50px',
                        padding: '0 10px',
                        paddingBottom: '50px',
                        width: '100vw',
                        maxWidth: '794px',
                        fontSize: '15px',
                      }}
                    >
                      {render(photo.text)}
                    </div>
                  </div>
                </>
              ) : props.album_type != "video_album" ? (
                <div
                  key={`video-player-content-main-video-${index}`}
                  id={`video-player-content-main-${index}`}
                  onMouseMove={(e) => {
                    const currentTime = new Date().getTime();
                    let fiveSecondsAdded = new Date();
                    fiveSecondsAdded.setMilliseconds(
                      fiveSecondsAdded.getMilliseconds() + 100
                    );
                    const shouldUpdateIfTimePassed =
                      nextTimeToUpdate < currentTime;
                    if (
                      !shouldPlay &&
                      shouldUpdateIfTimePassed &&
                      videoRef &&
                      videoRef.current &&
                      videoRef.current[index]
                    ) {
                      let currVideoPlayerRef = videoRef.current[index].current;
                      const totalDuration = currVideoPlayerRef.getDuration();

                      currVideoPlayerRef.seekTo(
                        currVideoPlayerRef.getCurrentTime() + 0.25,
                        "seconds"
                      );
                      setNextTimeToUpdate(fiveSecondsAdded.getTime());
                      setShouldPlay(false);
                    }
                  }}
                >
                  <ReactPlayer
                    ref={videoRef.current[index]}
                    url={photo.video.filename}
                    width="100%"
                    height="100%"
                    onProgress={(data) => {}}
                    onSeek={(e) => {}}
                    stopOnUnmount={false}
                    muted={props.album_type === "moving-images-album"}
                    playing={shouldPlay}
                    onEnded={() => setShouldPlay(false)}
                    playsinline={true}
                  />
                  <p
                    style={{
                      marginTop: "-2px",
                      marginBottom: "0",
                      textAlign: "right",
                      fontSize: "10.83px",
                      color: "#555",
                    }}
                  >
                    ㅤ{photo.video.title}
                  </p>

                  <div className={styles.textContainer} style={{display: 'flex', justifyContent: 'center', left: '0', width: '100%'}}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        marginTop: '-50px',
                        padding: '0 10px',
                        paddingBottom: '50px',
                        width: '100vw',
                        maxWidth: '794px',
                        fontSize: '15px',
                      }}
                    >
                      {render(photo.text)}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={styles.slide}
                  style={{ display: props.currIndex == index ? "flex" : "none" }}
                  >
                  <div>
                    <ReactPlayer
                      url={photo.url}
                      light={false}
                      controls={true}
                      playing={shouldPlay}
                      autoPlay
                    />
                  </div>
                  <p
                    style={{
                      marginTop: "5px",
                      marginBottom: "0",
                      textAlign: "right",
                      fontSize: "10.83px",
                      color: "#555",
                    }}
                  >
                    ㅤ{photo.title}
                  </p>

                  <div className={styles.textContainer} style={{display: 'flex', justifyContent: 'center', left: '0', width: '100%'}}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        marginTop: '-50px',
                        padding: '0 10px',
                        paddingBottom: '50px',
                        width: '100vw',
                        maxWidth: '794px',
                        fontSize: '15px',
                      }}
                    >
                      {render(photo.text)}
                      {console.log(props)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`${styles.buttons} ${props.type == "image" ? styles.image : ''}`}
        style={{ display: props.album_photos.length > 1 ? "block" : "none" }}
      >
        {componentToShowForVideoPlayer()}
        <button
          className={styles.button}
          onClick={() => {
            props.currIndex == 0
              ? handleDecreaseSlider()
              : handleDecreaseSlider();
          }}
          disabled={props.currIndex == 0}
        >
          Previous
        </button>

        <button
          className={styles.button}
          onClick={() => {
            props.currIndex == props.album_photos.length - 1
              ? handleIncreaseSlider()
              : handleIncreaseSlider();
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default PhotoSlider;
