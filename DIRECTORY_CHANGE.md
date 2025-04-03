# Directory Change - Photography to Photographs

The codebase has been updated to use "_content/photographs" directory instead of "_content/photography" to match the URL path.

## Manual Step Required

To complete this change, please run the following command in your terminal from the project root:

```bash
mkdir -p _content/photographs
cp _content/photography/*.json _content/photographs/
```

This will create the new "photographs" directory and copy all the JSON files from the old "photography" directory.

The API has been updated to search for content in both locations during the transition period, but moving the files is recommended for consistency.

## Files to Move

The following files should be moved:
- _content/photography/albums.json → _content/photographs/albums.json
- _content/photography/rabat.json → _content/photographs/rabat.json
- Any other album JSON files in the photography directory

## No Code Changes Needed

All the code references have already been updated to look in both locations, so once you've copied the files, everything should work smoothly.