import { MigrationInterface, QueryRunner } from "typeorm";

export class biographyNullableTrue1676570984896 implements MigrationInterface {
    name = 'biographyNullableTrue1676570984896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "biography" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "biography" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "biography" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "biography" SET NOT NULL`);
    }

}
