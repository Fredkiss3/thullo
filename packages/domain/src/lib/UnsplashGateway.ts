import { UnsplashPhoto } from "./types";

export interface UnsplashGateway {
  getPhoto(id: string): Promise<UnsplashPhoto | null>;
  getRandomPhoto(): Promise<UnsplashPhoto>;
  listPhotos(): Promise<UnsplashPhoto[]>;
  searchPhotos(query: string): Promise<UnsplashPhoto[]>;
}