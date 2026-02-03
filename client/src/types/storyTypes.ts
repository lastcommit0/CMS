export interface StoryAsset {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF' | 'AUDIO' | 'DOCUMENT';
  fileUrl: string;
  metadata?: any;
}

export interface StoryAssetRef {
  assetId: string;
  caption?: string;
  credit?: string;
}

export type InlineMark =
  | { type: 'bold'; start: number; end: number }
  | { type: 'italic'; start: number; end: number }
  | { type: 'underline'; start: number; end: number }
  | { type: 'link'; start: number; end: number; href: string };

export type StoryBlock =
  | {
    id: string;
    type: 'paragraph';
    data: {
      text: string;
      marks?: InlineMark[];
    };
  }
  | {
    id: string;
    type: 'heading';
    data: {
      level: 1 | 2 | 3 | 4 | 5 | 6;
      text: string;
    };
  }
  | {
    id: string;
    type: 'image';
    data: {
      assetId: string;
      caption?: string;
    };
  }
  | {
    id: string;
    type: 'video';
    data: {
      assetId: string;
    };
  }
  | {
    id: string;
    type: 'pdf';
    data: {
      assetId: string;
    };
  };

export interface EditorContent {
  version: '1.0';
  time?: number;
  blocks: StoryBlock[];
}

export interface StoryFormState {
  type: 'STORY' | 'LIVE_BLOG';
  storyUrl: string;
  shortTitle: string;
  articleTitle: string;
  slugIntro: string;

  description: EditorContent;
  highlights: EditorContent;

  topicTags: string[];

  seo: {
    metaKeywords: string;
    metaDescription: string;
    googleBot: 'ALLOW' | 'DISALLOW';
    excludeIA: boolean;
  };

  district?: string;
  mandal: string;

  coverImage?: StoryAssetRef;
  pdfAttachment?: StoryAssetRef;
  photoCaption?: string;
  photoCredit?: string;

  author: string;
  place?: string;

  enablePaywall: boolean;
  schedulePost: boolean;
  scheduleAt?: string;
}

export interface Story {
  id: string;
  type: 'STORY' | 'LIVE_BLOG';
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'SCHEDULED';

  storyUrl: string;
  shortTitle: string;
  articleTitle: string;
  slugIntro: string;

  description: EditorContent;
  highlights: EditorContent;

  topicTags: string[];

  seo: {
    metaKeywords: string;
    metaDescription: string;
    googleBot: 'ALLOW' | 'DISALLOW';
    excludeIA: boolean;
  };

  district?: string;
  mandal: string;

  coverImage?: StoryAssetRef;
  pdfAttachment?: StoryAssetRef;
  photoCaption?: string;
  photoCredit?: string;

  author: {
    id: string;
    name: string;
    email: string;
  };
  place?: string;

  enablePaywall: boolean;
  schedulePost: boolean;
  scheduleAt?: string;

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  assets?: StoryAsset[];
}

export interface CreateStoryRequest extends StoryFormState { }

export interface UpdateStoryRequest extends Partial<StoryFormState> {
  id: string;
}

export interface StoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'STORY' | 'LIVE_BLOG';
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'SCHEDULED';
  authorId?: string;
  district?: string;
  mandal?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StoryStats {
  published: number;
  pending: number;
  planned: number;
  holdReject: number;
}

export type Stats = StoryStats;