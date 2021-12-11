import { Member } from '@thullo/domain';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('members')
export class MemberEntity extends BaseEntity<Member> {
    @Column({
        type: 'text',
        unique: true
    })
    email?: string;

    @Column({
        nullable: true
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
            email: this.email!
        };
    }

    static fromDomain(member: Member): MemberEntity {
        const memberEntity = new MemberEntity();
        memberEntity.uuid = member.id;
        memberEntity.avatarURL = member.avatarURL;
        memberEntity.login = member.login;
        memberEntity.name = member.name;
        memberEntity.email = member.email;
        return memberEntity;
    }
}
