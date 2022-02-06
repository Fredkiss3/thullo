import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { container } from "tsyringe";

export type Photo = {
  id: string;
  // TODO: Add more fields
}

export class UnsplashService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.unsplash.com';
  }

  public async getRandomPhoto(query?: string): Promise<Photo> {
    const url = `${this.baseUrl}/photos/random?client_id=${this.apiKey}`;
    const params = query ? `&query=${query}` : '';
    const response = await axios.get(`${url}${params}`);
    const photo = await this.getPhoto(response.data.id);
    return photo;
  }

  public async getPhoto(id: string): Promise<Photo> {
    const url = `${this.baseUrl}/photos/${id}?client_id=${this.apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }
}