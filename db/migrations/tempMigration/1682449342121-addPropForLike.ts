import { MigrationInterface, QueryRunner } from "typeorm";

export class addPropForLike1682449342121 implements MigrationInterface {
    name = 'addPropForLike1682449342121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`like\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`like\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`like\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`like\` DROP COLUMN \`createdAt\``);
    }

}
