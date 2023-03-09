import { MigrationInterface, QueryRunner } from "typeorm";

export class notification1678032235321 implements MigrationInterface {
    name = 'notification1678032235321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`userId\` int NOT NULL, \`blogId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);

        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_705b6c7cdf9b2c2ff7ac7872cb7\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_705b6c7cdf9b2c2ff7ac7872cb7\` FOREIGN KEY (\`blogId\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_705b6c7cdf9b2c2ff7ac7872cb7\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_705b6c7cdf9b2c2ff7ac7872cb7\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
    }

}
