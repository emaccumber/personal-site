# Video Files Directory Structure

For the moving image albums feature, you'll need to create a directory structure as follows:

```
/public/videos
  /films
    /16mm-project
      - clip1.mp4
      - clip2.mp4
      - clip3.mp4
```

Place your short 16mm film clips in the appropriate directory. Each clip should be:
- Short (approximately 10 seconds in length)
- Compressed for web playback (.mp4 format with H.264 encoding recommended)
- Sized appropriately for web viewing (720p or 1080p resolution recommended)

## IMPORTANT UPDATE

You no longer need to create separate poster images for clips. The component automatically displays the first frame of each video clip.

The only image needed is a cover image for the album listing, which should be placed at:
`/public/images/films/16mm-project/cover.jpg`

## Legacy Notice

The `/public/videos/movingimages/` directory is deprecated. All new moving image albums should be placed in the `/public/videos/films/` directory instead.

## For Developers

If you find any README files in the `/public/videos/movingimages/` directory with outdated instructions about poster images, please disregard those instructions. The current implementation automatically uses the first frame of each video as its poster image.
