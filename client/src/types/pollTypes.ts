export interface PollOption {
  id: string;
  text: string;
  _count?: {
    votes: number;
  };
}

export interface Poll {
  id: string;
  question: string;
  storyId?: string | null;
  startsAt: string;
  endsAt: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED";
  options: PollOption[];
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreatePollRequest {
  question: string;
  storyId?: string;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  startsAt?: string;
  endsAt: string;
  options: Array<{ text: string }>;
}

export interface PollFilters {
  page?: number;
  limit?: number;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  storyId?: string;
}
