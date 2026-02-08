export interface StoryAsset {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'PDF' | 'AUDIO' | 'DOCUMENT';
  fileUrl: string;
  metadata?: any;
}

export interface StoryAssetInput {
  mediaId: string;
  isCover?: boolean;
  order?: number;
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
  status:
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'UNPUBLISHED'
  | 'REJECTED';
  storyType?: 'NEWS' | 'BLOG' | 'MAGAZINE' | 'VIDEO';

  storyUrl: string;
  shortTitle: string;
  articleTitle: string;
  slugIntro: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: EditorContent;
  highlightsContent?: EditorContent;

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

export interface CreateStoryPayload {
  title: string;
  shortTitle: string;
  slug: string;
  excerpt: string;
  content: EditorContent;
  highlights?: EditorContent;
  storyType: 'NEWS' | 'MAGAZINE' | 'BLOG' | 'VIDEO';
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEW' | 'PUBLISHED' | 'SCHEDULED';
  priority?: number;
  scheduleAt?: string;
  sectionIds?: string[];
  mandal?: string;
  district?: string;
  place?: string;
  photoCaption?: string;
  photoCredit?: string;
  topicTags?: string[];
  metaTags?: {
    metaKeywords?: string;
    metaDescription: string;
    googleBot?: 'ALLOW' | 'DISALLOW';
    excludeIA?: boolean;
  };
  assets: StoryAssetInput[];
}

export type CreateStoryRequest =
  | (StoryFormState & { assets?: StoryAssetInput[] })
  | CreateStoryPayload;

export interface UpdateStoryRequest extends Partial<StoryFormState> {
  id: string;
}

export interface StoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  storyType?: 'NEWS' | 'BLOG' | 'MAGAZINE' | 'VIDEO';
  type?: 'STORY' | 'LIVE_BLOG';
  status?:
  | 'DRAFT'
  | 'SUBMITTED'
  | 'REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'UNPUBLISHED'
  | 'REJECTED';
  authorId?: string;
  district?: string;
  mandal?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface StoryListResponse {
  stories: Story[];
  total: number;
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
