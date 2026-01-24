// types/priority.types.ts

export enum StoryStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
  SCHEDULED = 'SCHEDULED',
  ARCHIVED = 'ARCHIVED'
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  status: StoryStatus;
}

export interface Section {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface StorySection {
  id: string;
  storyId: string;
  sectionId: string;
  priority: number;
  isFeatured: boolean;
  story: Story;
  section: Section;
  author?: Author;
  managedBy?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface PriorityUpdate {
  storyId: string;
  sectionId: string;
  priority: number;
}

export interface PriorityLog {
  id: string;
  storyId: string;
  sectionId: string;
  oldPriority: number;
  newPriority: number;
  changedById: string;
  changedAt: string;
}

export interface GetPrioritiesParams {
  sectionId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PrioritiesResponse {
  data: StorySection[];
  total: number;
  page: number;
  limit: number;
}