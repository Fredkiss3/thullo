import {Entity, Column} from "typeorm";
import { Member } from "@thullo/domain";
import { BaseEntity } from "./BaseEntity";

@Entity('members')
export class MemberEntity extends BaseEntity<Member> {

  @Column({
    type: "text",
    unique: true,
  })
  idToken?: string;

  @Column({
    nullable: true,
  })
  avatarURL?: string | null;

  @Column()
  login?: string;

  @Column()
  name?: string;

  toDomain(): Member {
    return {
      id: this.uuid!,
      avatarURL: this.avatarURL!,
      login: this.login!,
      name: this.name!,
      idToken: this.idToken!,
    }
  }

  static fromDomain(member: Member): MemberEntity {
    const memberEntity = new MemberEntity();
    memberEntity.uuid = member.id;
    memberEntity.avatarURL = member.avatarURL;
    memberEntity.login = member.login;
    memberEntity.name = member.name;
    memberEntity.idToken = member.idToken;
    return memberEntity;
  }
}