import { UnsplashGateway, UnsplashPhoto } from '@thullo/domain';
import axios from 'axios';
import { container, singleton } from 'tsyringe';

export type ApiPhoto = {
    id: string;
    user: {
        name: string;
        username: string;
    };
    urls: {
        small: string; // small size
        regular: string; // medium
        thumb: string; // thumbnail
    };
    links: {
        download_location: string;
    };
};

/**
 * This service is responsible for fetching photos from Unsplash.
 * It uses the Unsplash API to fetch photos and make sure to respect Unsplash's guidelines.
 * See https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines for more details.
 */
@singleton()
export class UnsplashService implements UnsplashGateway {
    constructor(
        private apiKey: string,
        private perPage: number = 12,
        private baseURL: string = 'https://api.unsplash.com'
    ) {}

    public toPhoto(photo: ApiPhoto): UnsplashPhoto {
        return {
            id: photo.id,
            authorName: photo.user.name,
            authorUserName: photo.user.username,
            regularURL: photo.urls.regular,
            smallURL: photo.urls.small,
            thumbnailURL: photo.urls.thumb
        };
    }

    /**
     * Fetches a list of photos from Unsplash.
     * @param query The search query.
     */
    public async searchPhotos(query: string): Promise<UnsplashPhoto[]> {
        const response = await axios.get<{ results: ApiPhoto[] }>(
            `${this.baseURL}/search/photos?query=${query}&per_page=${this.perPage}&orientation=landscape`,
            {
                headers: {
                    Authorization: `Client-ID ${this.apiKey}`
                }
            }
        );

        return response.data.results.map(this.toPhoto);
    }

    public async getPhoto(id: string): Promise<UnsplashPhoto | null> {
        try {
            const response = await axios.get<ApiPhoto>(
                `${this.baseURL}/photos/${id}`,
                {
                    headers: {
                        Authorization: `Client-ID ${this.apiKey}`
                    }
                }
            );
            const photo = response.data;

            // Trigger unsplash download see: https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
            const { download_location } = photo.links;
            await axios.get(download_location, {
                headers: {
                    Authorization: `Client-ID ${this.apiKey}`
                }
            });

            return this.toPhoto(photo);
        } catch (error) {
            return null;
        }
    }

    public async getRandomPhoto(): Promise<UnsplashPhoto> {
        const response = await axios.get<ApiPhoto>(
            `${this.baseURL}/photos/random`,
            {
                headers: {
                    Authorization: `Client-ID ${this.apiKey}`
                }
            }
        );
        const photo = response.data;

        // Trigger unsplash download see: https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
        const { download_location } = photo.links;
        await axios.get(download_location, {
            headers: {
                Authorization: `Client-ID ${this.apiKey}`
            }
        });

        return this.toPhoto(photo);
    }

    public async listPhotos(): Promise<UnsplashPhoto[]> {
        const response = await axios.get<ApiPhoto[]>(
            `${this.baseURL}/photos?per_page=${this.perPage}`,
            {
                headers: {
                    Authorization: `Client-ID ${this.apiKey}`
                }
            }
        );

        return response.data.map(this.toPhoto);
    }
}

container.register('UnsplashGateway', {
    useValue: new UnsplashService(process.env.UNSPLASH_API_KEY!)
});
