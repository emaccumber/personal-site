// Photo types
export interface Photo {
  src: string;
  caption?: string;
  description?: string;
}

export interface PhotoAlbum {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage: string;
  photos: Photo[];
}

// Film types
export interface Film {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage: string;
  vimeoId?: string;
  type?: 'moving-image-album' | 'film';
  isMovingImageAlbum?: boolean;
  clips?: Clip[];
}

export interface Clip {
  id: string;
  title: string;
  src: string;
  thumbnail?: string;
}

// Writing types
export interface WritingPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content?: string;
  contentHtml?: string;
}

// Information types
export interface InformationContent {
  title: string;
  content: string;
  contentHtml: string;
}