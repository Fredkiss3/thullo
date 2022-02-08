import { UnsplashPhoto } from '@thullo/domain';

export class UnsplashPhotoBuilder {
    private id: string = 'id';
    private authorUserName: string = 'johndoe';
    private authorName: string = 'John Doe';
    private smallURL: string =
        'https://images.unsplash.com/photo-1501504905252-1234567890ab?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjF9';
    private regularURL: string =
        'https://images.unsplash.com/photo-1501504905252-1234567890ab?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9';
    private thumbnailURL: string =
        'https://images.unsplash.com/photo-1501504905252-1234567890ab?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjF9';

    withId(id: string): UnsplashPhotoBuilder {
        this.id = id;
        return this;
    }

    withAuthorUserName(authorUserName: string): UnsplashPhotoBuilder {
        this.authorUserName = authorUserName;
        return this;
    }

    withAuthorName(authorName: string): UnsplashPhotoBuilder {
        this.authorName = authorName;
        return this;
    }

    withSmallURL(smallURL: string): UnsplashPhotoBuilder {
        this.smallURL = smallURL;
        return this;
    }

    withRegularURL(regularURL: string): UnsplashPhotoBuilder {
        this.regularURL = regularURL;
        return this;
    }

    withThumbnailURL(thumbnailURL: string): UnsplashPhotoBuilder {
        this.thumbnailURL = thumbnailURL;
        return this;
    }

    build(): UnsplashPhoto {
        return {
            id: this.id,
            authorUserName: this.authorUserName,
            authorName: this.authorName,
            smallURL: this.smallURL,
            regularURL: this.regularURL,
            thumbnailURL: this.thumbnailURL,
        };
    }
}
