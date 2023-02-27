import { MigrationInterface, QueryRunner } from "typeorm";

export class blogRoleTagUser1676520915626 implements MigrationInterface {
    name = 'blogRoleTagUser1676520915626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "tag" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "userName" character varying NOT NULL, "biography" character varying NOT NULL, "roleId" integer, CONSTRAINT "REL_c28e52f758e7bbc53828db9219" UNIQUE ("roleId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog" ("id" SERIAL NOT NULL, "titlee" character varying NOT NULL, "content" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "view" integer NOT NULL DEFAULT '0', "userId" integer, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_tags_tag" ("blogId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_163bef1f79bd1f15b07f75e072d" PRIMARY KEY ("blogId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9572d27777384d535f77ed780d" ON "blog_tags_tag" ("blogId") `);
        await queryRunner.query(`CREATE INDEX "IDX_066934a149d9efba507443ce88" ON "blog_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "FK_9572d27777384d535f77ed780d0" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "FK_066934a149d9efba507443ce889" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "FK_066934a149d9efba507443ce889"`);
        await queryRunner.query(`ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "FK_9572d27777384d535f77ed780d0"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_fc46ede0f7ab797b7ffacb5c08d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_066934a149d9efba507443ce88"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9572d27777384d535f77ed780d"`);
        await queryRunner.query(`DROP TABLE "blog_tags_tag"`);
        await queryRunner.query(`DROP TABLE "blog"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
