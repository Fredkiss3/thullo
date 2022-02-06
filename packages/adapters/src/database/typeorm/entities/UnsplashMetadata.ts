import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity('metadata')
export class UnsplashMetadataEntity {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column()
  url?: string;

  @Column()
  authorUnsplashHandle?: string; // ex: "johndoe"

  @Column()
  authorName?: string; // ex: "John Doe"
}