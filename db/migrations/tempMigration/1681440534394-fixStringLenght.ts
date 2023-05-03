import { MigrationInterface, QueryRunner } from "typeorm";

export class fixStringLenght1681440534394 implements MigrationInterface {
    name = 'fixStringLenght1681440534394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`content\` varchar(10000) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`content\` varchar(255) NOT NULL`);
    }

}
