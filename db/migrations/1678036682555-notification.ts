import { MigrationInterface, QueryRunner } from "typeorm";

export class notification1678036682555 implements MigrationInterface {
    name = 'notification1678036682555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`userId\` int NOT NULL, \`blogId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`blog\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`blog\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`rating\` ADD CONSTRAINT \`FK_a6c53dfc89ba3188b389ef29a62\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rating\` ADD CONSTRAINT \`FK_e2b88b5b805420a9a6b86c3b052\` FOREIGN KEY (\`blogId\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_705b6c7cdf9b2c2ff7ac7872cb7\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_705b6c7cdf9b2c2ff7ac7872cb7\` FOREIGN KEY (\`id\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_705b6c7cdf9b2c2ff7ac7872cb7\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_705b6c7cdf9b2c2ff7ac7872cb7\``);
        await queryRunner.query(`ALTER TABLE \`rating\` DROP FOREIGN KEY \`FK_e2b88b5b805420a9a6b86c3b052\``);
        await queryRunner.query(`ALTER TABLE \`rating\` DROP FOREIGN KEY \`FK_a6c53dfc89ba3188b389ef29a62\``);
        await queryRunner.query(`ALTER TABLE \`blog\` CHANGE \`updated_at\` \`updated_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`blog\` CHANGE \`created_at\` \`created_at\` datetime NOT NULL`);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`ALTER TABLE \`rating\` ADD CONSTRAINT \`FK_ecda8ad32645327e4765b43649e\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
