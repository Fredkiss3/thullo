import { UnsplashGateway } from '@thullo/domain';
import { UnsplashPhoto } from '@thullo/domain';
import { UnsplashPhotoBuilder } from './UnsplashPhotoBuilder';

export class UnsplashGatewayBuilder {
    private getPhoto: (id: string) => Promise<UnsplashPhoto | null> = (
        id: string
    ) => Promise.resolve(null);

    private listPhotos: () => Promise<UnsplashPhoto[]> = () =>
        Promise.resolve([]);

    private searchPhotos: (query: string) => Promise<UnsplashPhoto[]> = (
        query: string
    ) => Promise.resolve([]);

    private getRandomPhoto: () => Promise<UnsplashPhoto> = () =>
        Promise.resolve(new UnsplashPhotoBuilder().build());

    public withGetPhoto(
        getPhoto: (id: string) => Promise<UnsplashPhoto | null>
    ): UnsplashGatewayBuilder {
        this.getPhoto = getPhoto;
        return this;
    }

    public withListPhotos(
        listPhotos: () => Promise<UnsplashPhoto[]>
    ): UnsplashGatewayBuilder {
        this.listPhotos = listPhotos;
        return this;
    }

    public withSearchPhotos(
        searchPhotos: (query: string) => Promise<UnsplashPhoto[]>
    ): UnsplashGatewayBuilder {
        this.searchPhotos = searchPhotos;
        return this;
    }

    public withGetRandomPhoto(
        getRandomPhoto: () => Promise<UnsplashPhoto>
    ): UnsplashGatewayBuilder {
        this.getRandomPhoto = getRandomPhoto;
        return this;
    }

    public build(): UnsplashGateway {
        return {
            getPhoto: this.getPhoto,
            listPhotos: this.listPhotos,
            searchPhotos: this.searchPhotos,
            getRandomPhoto: this.getRandomPhoto
        };
    }
}
