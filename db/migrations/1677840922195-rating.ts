import { MigrationInterface, QueryRunner } from "typeorm";

export class rating1677840922195 implements MigrationInterface {
    name = 'rating1677840922195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rating\` (\`id\` int NOT NULL AUTO_INCREMENT, \`star\` int NOT NULL, \`createdAt\` datetime NOT NULL, \`updatedAt\` datetime NOT NULL, \`userId\` int NOT NULL, \`blogId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);

        await queryRunner.query(`ALTER TABLE \`rating\` ADD CONSTRAINT \`FK_ecda8ad32645327e4765b43649e\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);

        await queryRunner.query(`ALTER TABLE \`rating\` ADD CONSTRAINT \`FK_ecda8ad32645327e4765b43649e\` FOREIGN KEY (\`id\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rating\` DROP FOREIGN KEY \`FK_ecda8ad32645327e4765b43649e\``);
        await queryRunner.query(`ALTER TABLE \`rating\` DROP FOREIGN KEY \`FK_ecda8ad32645327e4765b43649e\``);
        await queryRunner.query(`DROP TABLE \`rating\``);
    }

}
