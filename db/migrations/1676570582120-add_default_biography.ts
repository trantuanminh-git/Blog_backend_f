import { MigrationInterface, QueryRunner } from "typeorm";

export class addDefaultBiography1676570582120 implements MigrationInterface {
    name = 'addDefaultBiography1676570582120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" RENAME COLUMN "titlee" TO "title"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "biography" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "biography" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "blog" RENAME COLUMN "title" TO "titlee"`);
    }

}
