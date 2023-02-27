import { MigrationInterface, QueryRunner } from "typeorm";

export class userUsername1676543730196 implements MigrationInterface {
    name = 'userUsername1676543730196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "userName" TO "username"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "username" TO "userName"`);
    }

}
