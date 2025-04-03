# Image Path Change Required

The codebase has been updated to use "photographs" instead of "photography" throughout. However, there's a manual step needed to complete this transition.

## Required Steps

1. Rename the image directory:
```bash
mkdir -p public/images/photographs
cp -r public/images/photography/* public/images/photographs/
```

2. All JSON files have been updated to reference the new path `/images/photographs/...` instead of `/images/photography/...`

3. After making these changes, rebuild the site with:
```bash
npm run build
```

## What Changed

1. The content directory was changed from `_content/photography` to `_content/photographs`
2. All API functions were updated to load from the new directory
3. All JSON files were updated to reference images at `/images/photographs/...` instead of `/images/photography/...`

The missing step is to move the actual image files to the new directory structure to match the updated references.