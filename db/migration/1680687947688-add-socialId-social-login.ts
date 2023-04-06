import { MigrationInterface, QueryRunner } from "typeorm";

export class addSocialIdSocialLogin1680687947688 implements MigrationInterface {
    name = 'addSocialIdSocialLogin1680687947688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`socialId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`social\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`social\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`socialId\``);
    }

}
