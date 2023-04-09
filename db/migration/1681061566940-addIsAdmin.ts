import { MigrationInterface, QueryRunner } from "typeorm";

export class addIsAdmin1681061566940 implements MigrationInterface {
    name = 'addIsAdmin1681061566940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` ADD \`isAdmin\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`isAdmin\``);
    }

}
