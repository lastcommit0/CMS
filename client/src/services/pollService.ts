import apiClient, { type ApiResponse } from "@/lib/api/axiosClient";
import type { Poll, CreatePollRequest, PollFilters } from "@/types/pollTypes";
import { POLL_URL } from "@/lib/config";

export const pollApi = {
    getPolls: (filters: PollFilters) =>
        apiClient.get<
            ApiResponse<Poll[]> & {
                pagination?: {
                    page: number;
                    limit: number;
                    total: number;
                    totalPages: number;
                };
            }
        >(`${POLL_URL}/polls`, { params: filters }),

    getPollById: (id: string) =>
        apiClient.get<ApiResponse<Poll>>(`${POLL_URL}/poll/${id}`),

    createPoll: (data: CreatePollRequest) =>
        apiClient.post<ApiResponse<Poll>>(`${POLL_URL}/poll`, data),

    updatePoll: (id: string, data: Partial<CreatePollRequest>) =>
        apiClient.post<ApiResponse<Poll>>(`${POLL_URL}/poll/${id}`, data),

    deletePoll: (id: string) =>
        apiClient.delete<ApiResponse<{ success: boolean }>>(`${POLL_URL}/poll/${id}`),

    vote: (pollId: string, optionId: string) =>
        apiClient.post<ApiResponse<Poll>>(`${POLL_URL}/poll/${pollId}/vote`, { optionId }),

    getResults: (pollId: string) =>
        apiClient.get<ApiResponse<{ results: Record<string, number> }>>(`${POLL_URL}/poll/${pollId}/results`),
};
