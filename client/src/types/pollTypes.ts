export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Poll {
    id: string;
    title: string;
    description?: string;
    options: PollOption[];
    expiresAt: string;
    isActive: boolean;
    forAllArticles: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePollRequest {
    title: string;
    description?: string;
    options: string[];
    expiresAt: string;
    isActive?: boolean;
    forAllArticles?: boolean;
}

export interface PollFilters {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}
