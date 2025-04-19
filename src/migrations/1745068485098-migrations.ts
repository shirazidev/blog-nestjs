import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1745068485098 implements MigrationInterface {
  name = "Migrations1745068485098";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_otp" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "method" character varying, "expires_in" TIMESTAMP NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_494c022ed33e6ee19a2bbb11b22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile" ("id" SERIAL NOT NULL, "nick_name" character varying NOT NULL, "bio" character varying, "image_profile" character varying, "image_bg" character varying, "gender" character varying, "birth_date" TIMESTAMP, "linkedin" character varying, "twitter" character varying, "userId" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_51cb79b5555effaf7d69ba1cff" UNIQUE ("userId"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_likes" ("id" SERIAL NOT NULL, "blogId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_92ed5e155b9560753110e73c11f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_bookmarks" ("id" SERIAL NOT NULL, "blogId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_5ec2194eb572932a9d1177721ee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_comments" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "accepted" boolean NOT NULL DEFAULT true, "blogId" integer NOT NULL, "userId" integer NOT NULL, "parentId" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b478aaeecf38441a25739aa9610" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "priority" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_category" ("id" SERIAL NOT NULL, "blogId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_32b67ddf344608b5c2fb95bc90c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "short_desc" character varying NOT NULL, "content" character varying NOT NULL, "image" character varying, "slug" character varying NOT NULL, "time_for_study" character varying NOT NULL, "authorId" integer NOT NULL, "categoryId" integer, "status" character varying NOT NULL DEFAULT 'draft', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0dc7e58d73a1390874a663bd599" UNIQUE ("slug"), CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_images" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, "alt" character varying NOT NULL, "userId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8c5d93e1b746bef23c0cf9aa3a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "follow" ("id" SERIAL NOT NULL, "followingId" integer NOT NULL, "followerId" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying, "phone" character varying, "email" character varying, "role" character varying NOT NULL DEFAULT 'user', "status" character varying NOT NULL DEFAULT 'normal', "newEmail" character varying, "newPhone" character varying, "verifyEmail" boolean NOT NULL DEFAULT false, "verifyPhone" boolean DEFAULT false, "password" character varying, "otpId" integer, "profileId" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_6fb331a62891faa08724fe2f188" UNIQUE ("newEmail"), CONSTRAINT "UQ_8b5e6dd9d22c9f5cece5d2105f2" UNIQUE ("newPhone"), CONSTRAINT "REL_483a6adaf636e520039e97ef61" UNIQUE ("otpId"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profile" ADD CONSTRAINT "FK_51cb79b5555effaf7d69ba1cff9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_likes" ADD CONSTRAINT "FK_26aab4d17339481b1058f98b215" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_likes" ADD CONSTRAINT "FK_7bcacc0bdda9cebe542d5664b01" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_bookmarks" ADD CONSTRAINT "FK_411f534a07a940f732b8b8c66a2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_bookmarks" ADD CONSTRAINT "FK_6c97b1e5a840d4d1bda44aa91f5" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_166954a3340789682daf335b3f4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_c5841a0dd900a8e78146810d909" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_02b996a30d6a7a934ef71d97739" FOREIGN KEY ("parentId") REFERENCES "blog_comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_category" ADD CONSTRAINT "FK_2aaa4f0c0157842269566dd7dcd" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_category" ADD CONSTRAINT "FK_ddc1b5494f40c12c5e71c0150ec" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog" ADD CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_images" ADD CONSTRAINT "FK_e82761c6ff8ebd2e7c90958e87d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follow" ADD CONSTRAINT "FK_e9f68503556c5d72a161ce38513" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_483a6adaf636e520039e97ef617" FOREIGN KEY ("otpId") REFERENCES "user_otp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_483a6adaf636e520039e97ef617"`);
    await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_e9f68503556c5d72a161ce38513"`);
    await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`);
    await queryRunner.query(`ALTER TABLE "user_images" DROP CONSTRAINT "FK_e82761c6ff8ebd2e7c90958e87d"`);
    await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb"`);
    await queryRunner.query(`ALTER TABLE "blog_category" DROP CONSTRAINT "FK_ddc1b5494f40c12c5e71c0150ec"`);
    await queryRunner.query(`ALTER TABLE "blog_category" DROP CONSTRAINT "FK_2aaa4f0c0157842269566dd7dcd"`);
    await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_02b996a30d6a7a934ef71d97739"`);
    await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_c5841a0dd900a8e78146810d909"`);
    await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_166954a3340789682daf335b3f4"`);
    await queryRunner.query(`ALTER TABLE "blog_bookmarks" DROP CONSTRAINT "FK_6c97b1e5a840d4d1bda44aa91f5"`);
    await queryRunner.query(`ALTER TABLE "blog_bookmarks" DROP CONSTRAINT "FK_411f534a07a940f732b8b8c66a2"`);
    await queryRunner.query(`ALTER TABLE "blog_likes" DROP CONSTRAINT "FK_7bcacc0bdda9cebe542d5664b01"`);
    await queryRunner.query(`ALTER TABLE "blog_likes" DROP CONSTRAINT "FK_26aab4d17339481b1058f98b215"`);
    await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "FK_51cb79b5555effaf7d69ba1cff9"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "follow"`);
    await queryRunner.query(`DROP TABLE "user_images"`);
    await queryRunner.query(`DROP TABLE "blog"`);
    await queryRunner.query(`DROP TABLE "blog_category"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "blog_comments"`);
    await queryRunner.query(`DROP TABLE "blog_bookmarks"`);
    await queryRunner.query(`DROP TABLE "blog_likes"`);
    await queryRunner.query(`DROP TABLE "user_profile"`);
    await queryRunner.query(`DROP TABLE "user_otp"`);
  }
}
