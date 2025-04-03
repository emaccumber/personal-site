# Moving Images Content

This directory should contain JSON files for your moving image albums.

## File Structure

### albums.json
This file lists all your moving image albums.

```json
{
  "albums": [
    {
      "slug": "16mm-project",
      "title": "16mm Film Sketches",
      "description": "A collection of short clips captured on 16mm film",
      "coverImage": "/images/movingimages/16mm-project/cover.jpg",
      "featured": true
    }
  ]
}
```

### Individual Album Files (e.g., 16mm-project.json)
Each album should have its own JSON file with clip details:

```json
{
  "title": "16mm Film Sketches",
  "description": "A collection of short clips captured on 16mm film during travels across the American West.",
  "clips": [
    {
      "id": 1,
      "src": "/videos/movingimages/16mm-project/clip1.mp4",
      "poster": "/images/movingimages/16mm-project/clip1.jpg",
      "caption": "Utah Desert, 2024",
      "description": "Windswept sand patterns at dusk in the Utah desert."
    },
    {
      "id": 2,
      "src": "/videos/movingimages/16mm-project/clip2.mp4",
      "poster": "/images/movingimages/16mm-project/clip2.jpg",
      "caption": "New Mexico, 2024",
      "description": "Distant storm clouds forming over mesa landscape."
    }
  ]
}
```

## Media Files
Store your actual video files in:
- `/public/videos/movingimages/[album-slug]/`

And your poster images in:
- `/public/images/movingimages/[album-slug]/`