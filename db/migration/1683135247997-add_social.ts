import { MigrationInterface, QueryRunner } from "typeorm";

export class addSocial1683135247997 implements MigrationInterface {
    name = 'addSocial1683135247997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` ADD \`isAdmin\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`socialId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`social\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`like\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`like\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_19c3cafec5114c778a641cced21\``);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`blogId\` \`blogId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`content\` varchar(10000) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_19c3cafec5114c778a641cced21\` FOREIGN KEY (\`blogId\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_19c3cafec5114c778a641cced21\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`blogId\` \`blogId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_19c3cafec5114c778a641cced21\` FOREIGN KEY (\`blogId\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`like\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`social\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`socialId\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP COLUMN \`isAdmin\``);
    }

}
