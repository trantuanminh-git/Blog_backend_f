import { MigrationInterface, QueryRunner } from "typeorm";

export class thang1678253455836 implements MigrationInterface {
    name = 'thang1678253455836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, \`userId\` int NOT NULL, \`blogId\` int NOT NULL, \`parentId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`like\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`blogId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`averageRating\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`likeCount\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`cmtCount\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`shares\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_c28e52f758e7bbc53828db9219\` (\`roleId\`)`);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_c28e52f758e7bbc53828db9219\` ON \`user\` (\`roleId\`)`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_0b0e4bbc8415ec426f87f3a88e2\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_0b0e4bbc8415ec426f87f3a88e2\` FOREIGN KEY (\`id\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_0b0e4bbc8415ec426f87f3a88e2\` FOREIGN KEY (\`id\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like\` ADD CONSTRAINT \`FK_eff3e46d24d416b52a7e0ae4159\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like\` ADD CONSTRAINT \`FK_eff3e46d24d416b52a7e0ae4159\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_eff3e46d24d416b52a7e0ae4159\``);
        await queryRunner.query(`ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_eff3e46d24d416b52a7e0ae4159\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_0b0e4bbc8415ec426f87f3a88e2\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_0b0e4bbc8415ec426f87f3a88e2\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_0b0e4bbc8415ec426f87f3a88e2\``);
        await queryRunner.query(`DROP INDEX \`REL_c28e52f758e7bbc53828db9219\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`updated_at\` datetime(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`created_at\` datetime(0) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_c28e52f758e7bbc53828db9219\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`shares\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`cmtCount\``);
        await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`likeCount\``);
        await queryRunner.query(`ALTER TABLE \`blog\` ADD \`averageRating\` float NULL`);
        await queryRunner.query(`DROP TABLE \`like\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
    }

}
