import { MigrationInterface, QueryRunner } from "typeorm";

export class updateRefreshToken1676847123491 implements MigrationInterface {
    name = 'updateRefreshToken1676847123491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
    }

}
