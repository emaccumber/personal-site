# Moving Image Albums

This is a special type of film content that displays short video clips in an album format.

## How to Add a Moving Image Album

1. First, add your moving image album to the list of films in `films.json`. Add a `type` field with the value `moving-image-album`:

```json
{
  "films": [
    {
      "id": "16mm-project",
      "title": "16mm Film Sketches",
      "slug": "16mm-project",
      "description": "A collection of short clips captured on 16mm film",
      "coverImage": "/images/films/16mm-project/cover.jpg",
      "type": "moving-image-album"
    },
    ...other films...
  ]
}
```

2. Create a JSON file for your moving image album (e.g., `16mm-project.json`) in this directory:

```json
{
  "title": "16mm Film Sketches",
  "description": "A collection of short clips captured on 16mm film during travels across the American West.",
  "date": "2024",
  "clips": [
    {
      "id": 1,
      "src": "/videos/films/16mm-project/clip1.mp4",
      "caption": "Utah Desert, 2024",
      "description": "Windswept sand patterns at dusk in the Utah desert."
    },
    {
      "id": 2,
      "src": "/videos/films/16mm-project/clip2.mp4",
      "caption": "New Mexico, 2024",
      "description": "Distant storm clouds forming over mesa landscape."
    }
  ]
}
```

3. Add your video clips to `/public/videos/films/[album-slug]/` (e.g., `/public/videos/films/16mm-project/clip1.mp4`)

4. Add a cover image for the album listing to `/public/images/films/[album-slug]/cover.jpg`

## Features

These moving image albums include several interactive features:

1. **Frame-by-Frame Scrubbing**: Move your mouse from left to right over the video to advance through the clip frame by frame.

2. **Smart Playback**: The play button starts playback from wherever you've scrubbed to, and is the only way to restart a clip after it ends.

3. **First-Frame Previews**: No need to create separate poster images - the component automatically displays the first frame of each video.

4. **Keyboard Navigation**: Use left/right arrow keys to navigate between clips and spacebar to play/pause.

## User Interaction

- **Scrubbing through frames**: Move your mouse from left to right over the clip when it's not playing
- **Play/Pause**: Click the play button to start playback from the current frame
- **Navigate between clips**: Click the arrow buttons or use left/right arrow keys
- **Select specific clips**: Use the numbered clip buttons below the video

## Recommended Video Format

For the best performance, use the following specifications for your video clips:
- Format: MP4 with H.264 encoding
- Resolution: 720p or 1080p
- Duration: Short clips (around 10 seconds)
- File size: Optimize for web (typically under 5MB per clip)

## Directory Structure

```
public/
  ├── videos/
  │   └── films/
  │       └── [album-slug]/
  │           ├── clip1.mp4
  │           ├── clip2.mp4
  │           └── clip3.mp4
  └── images/
      └── films/
          └── [album-slug]/
              └── cover.jpg  (for album listing)
```
