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
      "poster": "/images/films/16mm-project/clip1.jpg",
      "caption": "Utah Desert, 2024",
      "description": "Windswept sand patterns at dusk in the Utah desert."
    },
    {
      "id": 2,
      "src": "/videos/films/16mm-project/clip2.mp4",
      "poster": "/images/films/16mm-project/clip2.jpg",
      "caption": "New Mexico, 2024",
      "description": "Distant storm clouds forming over mesa landscape."
    }
  ]
}
```

3. Add your video clips to `/public/videos/films/[album-slug]/` (e.g., `/public/videos/films/16mm-project/clip1.mp4`)

4. Add poster images (thumbnails shown before video playback) to `/public/images/films/[album-slug]/` (e.g., `/public/images/films/16mm-project/clip1.jpg`)

5. Add a cover image for the album listing to `/public/images/films/[album-slug]/cover.jpg`

## Recommended Video Format

For the best performance, use the following specifications for your video clips:
- Format: MP4 with H.264 encoding
- Resolution: 720p or 1080p
- Duration: Short clips (around 10 seconds)
- File size: Optimize for web (typically under 5MB per clip)
