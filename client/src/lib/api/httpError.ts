import { AxiosError } from 'axios';

export class HttpError extends Error {
  status?: number;
  data?: unknown;

  constructor(error: AxiosError) {
    super(error.message);
    this.status = error.response?.status;
    this.data = error.response?.data;
  }
}
