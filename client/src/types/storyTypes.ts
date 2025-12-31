
export interface Story {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  storyType: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'SCHEDULED';
  status: 'NEWS' | 'MAGAZINE' | 'BLOG' | 'VIDEO' | 'PDF';
  priority: number;
  published: boolean;
  scheduleAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  sections?: any[];
  assets?: StoryAsset[];
  metaTags?: MetaTag;
}

export interface StoryAsset {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF' | 'AUDIO' | 'DOCUMENT';
  fileUrl: string;
  metadata?: any;
}

export interface MetaTag {
  metaKeywords?: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface CreateStoryData {
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  storyType: Story['storyType'];
  status: Story['status'];
  priority?: number;
  scheduleAt?: string;
  sectionIds?: string[];
  metaTags?: MetaTag;
}

export interface viewStoryData {
  id: string;
  title: string;
  Author: string;
  ApprovedBy: string;
  status: string;
}

export interface EditorContent {
  blocks: Array<
    | { type: 'paragraph'; text: string }
    | { type: 'heading'; level: number; text: string }
    | { type: 'image'; assetId: string }
    | { type: 'video'; assetId: string }
    | { type: 'pdf'; assetId: string }
  >;
}


export interface StoryAssetRef {
  assetId: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF';
  fileUrl: string;
}


export interface StoryFormState {
  id?: string;                
  type: 'STORY' | 'LIVE_BLOG';
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED';

  storyUrl: string;
  shortTitle: string;
  articleTitle: string;
  slugIntro: string;

  description: string;  
  content: EditorContent;     
  highlights: string;

  topicTags: string[];      
  
  seo: {
    metaKeywords: string;
    metaDescription: string;
    googleBot: 'ALLOW' | 'DISALLOW';
    excludeIA: boolean;
  };

  coverImage?: StoryAssetRef;
  pdfAttachment?: StoryAssetRef;

  author: string;
  place?: string;
  district?: string;
  mandal: string;

  photoCaption?: string;
  photoCredit?: string;

  enablePaywall: boolean;
  schedulePost: boolean;
  scheduleAt?: string;
}



export interface StoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  storyType?: string;
  status?: string;
  published?: boolean;
  authorId?: string;
}

export interface PaginatedResponse<T> {
  stories: T[];
  total: number;
}


export interface Stats {
  published: number;
  pending: number;
  planned: number;
  holdReject: number;
}