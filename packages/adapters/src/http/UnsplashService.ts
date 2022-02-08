import axios from "axios";

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
    return await this.getPhoto(response.data.id);
  }

  public async getPhoto(id: string): Promise<Photo> {
    const url = `${this.baseUrl}/photos/${id}?client_id=${this.apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }
}