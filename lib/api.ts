import fs from 'fs'
import path from 'path'

// Use absolute paths for better debugging
const contentDirectory = path.join(process.cwd(), '_content')
console.log('Content directory path:', contentDirectory)

const photosDirectory = path.join(contentDirectory, 'photographs')
const videosDirectory = path.join(contentDirectory, 'videography')
const postsDirectory = path.join(contentDirectory, 'blog')
const filmsDirectory = path.join(contentDirectory, 'films')
const informationDirectory = path.join(contentDirectory, 'information')

// Log information directory for debugging
console.log('Information directory path:', informationDirectory)

// Define types for better type safety
interface PhotoAlbum {
  id: string
  title: string
  slug: string
  coverImage: string
  date: string
  description: string
  photos: any[]
}

interface Film {
  id: string
  title: string
  slug: string
  coverImage: string
  vimeoId: string
  date: string
  description: string
}

interface InformationContent {
  title: string
  content: string
}

// Add this interface
interface Photo {
  filename: string
  caption?: string
}

// Photos API
export function getAllPhotoAlbums() {
  console.log('Getting all photo albums from:', photosDirectory)
  
  try {
    const albumsPath = path.join(photosDirectory, 'albums.json')
    console.log('Reading albums from:', albumsPath)
    
    if (!fs.existsSync(albumsPath)) {
      console.log('albums.json not found at:', albumsPath)
      return []
    }
    
    const fileContents = fs.readFileSync(albumsPath, 'utf8')
    console.log('Albums file contents:', fileContents.substring(0, 200) + '...')
    
    const data = JSON.parse(fileContents)
    console.log('Parsed albums data:', data)
    
    return data.albums || []
  } catch (error) {
    console.error('Error reading photo albums:', error)
    return []
  }
}

export function getPhotoAlbumBySlug(slug: string): PhotoAlbum | null {
  console.log('Getting photo album by slug:', slug)
  
  try {
    // First get all albums to find the one with matching slug
    const albums = getAllPhotoAlbums()
    const album = albums.find((album: PhotoAlbum) => album.slug === slug)
    
    if (!album) {
      console.log('Album not found in albums.json:', slug)
      return null
    }
    
    // Then load the photos for this album
    const photosPath = path.join(photosDirectory, `${slug}.json`)
    console.log('Loading photos from:', photosPath)
    
    if (!fs.existsSync(photosPath)) {
      console.log('Photos file not found:', photosPath)
      // Return album without photos
      return { ...album, photos: [] }
    }
    
    const photosContents = fs.readFileSync(photosPath, 'utf8')
    const photosData = JSON.parse(photosContents)
    
    // Combine album data with photos
    return {
      ...album,
      photos: photosData.photos || []
    }
  } catch (error) {
    console.error('Error reading photo album:', error)
    return null
  }
}

export function getPhotoByIndex(albumSlug: string, photoIndex: number): Photo | null {
  const album = getPhotoAlbumBySlug(albumSlug)
  
  if (!album || !album.photos || photoIndex >= album.photos.length) {
    return null
  }
  
  return album.photos[photoIndex]
}

// Films API
export function getAllFilms() {
  console.log('Getting all films from:', filmsDirectory)
  
  try {
    const filmsPath = path.join(filmsDirectory, 'films.json')
    console.log('Reading films from:', filmsPath)
    
    if (!fs.existsSync(filmsPath)) {
      console.log('films.json not found at:', filmsPath)
      return []
    }
    
    const fileContents = fs.readFileSync(filmsPath, 'utf8')
    const data = JSON.parse(fileContents)
    
    return data.films || []
  } catch (error) {
    console.error('Error reading films:', error)
    return []
  }
}

export function getFilmBySlug(slug: string): Film | null {
  console.log('Getting film by slug:', slug)
  
  try {
    const films = getAllFilms()
    const film = films.find((film: Film) => film.slug === slug)
    
    if (!film) {
      console.log('Film not found:', slug)
      return null
    }
    
    // Load detailed film data from individual JSON file
    const filmDataPath = path.join(filmsDirectory, `${slug}.json`)
    console.log('Loading film data from:', filmDataPath)
    
    if (!fs.existsSync(filmDataPath)) {
      console.log('Film data file not found:', filmDataPath)
      // Return basic film info even if detailed data is missing
      return film
    }
    
    const filmDataContents = fs.readFileSync(filmDataPath, 'utf8')
    const filmData = JSON.parse(filmDataContents)
    
    // Merge basic metadata with detailed data
    return {
      ...film,
      ...filmData
    }
  } catch (error) {
    console.error('Error reading film:', error)
    return null
  }
}

// Moving Image Albums API
export function getAllMovingImageAlbums() {
  console.log('Getting all moving image albums from:', filmsDirectory)
  
  try {
    const albumsPath = path.join(filmsDirectory, 'moving-image-albums.json')
    console.log('Reading moving image albums from:', albumsPath)
    
    if (!fs.existsSync(albumsPath)) {
      console.log('moving-image-albums.json not found at:', albumsPath)
      return []
    }
    
    const fileContents = fs.readFileSync(albumsPath, 'utf8')
    const data = JSON.parse(fileContents)
    
    return data.albums || []
  } catch (error) {
    console.error('Error reading moving image albums:', error)
    return []
  }
}

export function getMovingImageAlbumBySlug(slug: string) {
  console.log('Getting moving image album by slug:', slug)
  
  try {
    // First get all albums to find the one with matching slug
    const albums = getAllMovingImageAlbums()
    const album = albums.find((album: any) => album.slug === slug)
    
    if (!album) {
      console.log('Moving image album not found in moving-image-albums.json:', slug)
      return null
    }
    
    // Then load the clips for this album
    const clipsPath = path.join(filmsDirectory, `${slug}.json`)
    console.log('Loading clips from:', clipsPath)
    
    if (!fs.existsSync(clipsPath)) {
      console.log('Clips file not found:', clipsPath)
      // Return album without clips
      return { ...album, clips: [] }
    }
    
    const clipsContents = fs.readFileSync(clipsPath, 'utf8')
    const clipsData = JSON.parse(clipsContents)
    
    // Combine album data with clips
    return {
      ...album,
      clips: clipsData.clips || []
    }
  } catch (error) {
    console.error('Error reading moving image album:', error)
    return null
  }
}

export function getClipByIndex(albumSlug: string, clipIndex: number) {
  const album = getMovingImageAlbumBySlug(albumSlug)
  
  if (!album || !album.clips || clipIndex >= album.clips.length) {
    return null
  }
  
  return album.clips[clipIndex]
}

// Information API
export function getInformationContent(): InformationContent | null {
  console.log('Getting information content from:', informationDirectory)
  
  try {
    const aboutPath = path.join(informationDirectory, 'about.mdx')
    console.log('Reading about content from:', aboutPath)
    
    if (!fs.existsSync(aboutPath)) {
      console.log('about.mdx not found at:', aboutPath)
      return null
    }
    
    const fileContents = fs.readFileSync(aboutPath, 'utf8')
    
    // For now, just return simple HTML content
    // We can parse the frontmatter manually if needed
    const content = fileContents
      .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
      .replace(/## Contact/g, '<h2>Contact</h2>')
      .replace(/\[@emaccumber\]\(https:\/\/instagram\.com\/emaccumber\)/g, '<a href="https://instagram.com/emaccumber">@emaccumber</a>')
      .trim()
    
    return {
      title: 'About Ethan MacCumber',
      content: `<p>${content.replace(/\n\n/g, '</p><p>')}</p>`
    }
  } catch (error) {
    console.error('Error reading information content:', error)
    return null
  }
}

// Placeholder functions (not implemented yet)
export function getAllPhotoCollections() {
  // This would return all photo collections when implemented
  return []
}

export function getPhotoCollection(id: string) {
  // This would return a specific photo collection when implemented
  return null
}

export function getAllVideos() {
  // This would return all videos when implemented
  return []
}

export function getVideo(id: string) {
  // This would return a specific video when implemented
  return null
}