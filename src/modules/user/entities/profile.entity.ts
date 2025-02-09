import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity(EntityNames.Profile)
export class ProfileEntity extends BaseEntity {
    @Column()
    nick_name: string;
    @Column({nullable: true})
    bio: string;
    @Column({nullable: true})
    image_profile: string;
    @Column({nullable: true})
    image_bg: string;
    @Column({nullable: true})
    gender: string;
    @Column({nullable: true})
    birth_date: Date;
    @Column({nullable: true})
    linkedin: string;
    @Column({nullable: true})
    twitter: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
