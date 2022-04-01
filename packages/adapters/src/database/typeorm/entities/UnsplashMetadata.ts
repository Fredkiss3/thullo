import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { UnsplashPhoto } from '@thullo/domain';

@Entity('metadata')
export class UnsplashMetadataEntity {
    @ObjectIdColumn()
    id?: ObjectID;

    @Column()
    photoId?: string;

    @Column()
    url?: string;

    @Column()
    thumbnailURL?: string;

    @Column()
    smallURL?: string;

    @Column()
    authorUsername?: string; // ex: "johndoe"

    @Column()
    authorName?: string; // ex: "John Doe"

    static toDomain(photo: UnsplashMetadataEntity): UnsplashPhoto {
        return {
            id: photo.photoId!,
            regularURL: photo.url!,
            thumbnailURL: photo.thumbnailURL!,
            smallURL: photo.smallURL!,
            authorUserName: photo.authorUsername!,
            authorName: photo.authorName!
        };
    }

    static fromDomain(photo: UnsplashPhoto): UnsplashMetadataEntity {
        const metadata = new UnsplashMetadataEntity();
        metadata.url = photo.regularURL;
        metadata.thumbnailURL = photo.thumbnailURL;
        metadata.smallURL = photo.smallURL;
        metadata.authorUsername = photo.authorUserName;
        metadata.authorName = photo.authorName;
        metadata.photoId = photo.id;
        return metadata;
    }
}
