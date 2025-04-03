# DEPRECATED - Moving Images Content

Moving images have been integrated into the films section. 

Please refer to the updated documentation in:
`/Users/ethan/Desktop/repos.nosync/personal-site/_content/films/README-moving-images.md`

The moving image albums are now implemented as a special type of film with the following advantages:
- No need for separate poster images (automatically uses first frame of video)
- Frame-by-frame scrubbing through clips
- Integrated with the existing films section

## Directory Structure

Moving image content has been moved to:

```
public/
  ├── videos/
  │   └── films/        (previously movingimages)
  │       └── [album-slug]/
  │           ├── clip1.mp4
  │           ├── clip2.mp4
  │           └── clip3.mp4
  └── images/
      └── films/        (previously movingimages)
          └── [album-slug]/
              └── cover.jpg  (only need album cover image, not individual clip posters)
```

## JSON Format

The JSON format has been simplified to remove the poster requirement:

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
    }
  ]
}
```
