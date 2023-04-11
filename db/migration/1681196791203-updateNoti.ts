import { MigrationInterface, QueryRunner } from "typeorm";

export class updateNoti1681196791203 implements MigrationInterface {
    name = 'updateNoti1681196791203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_19c3cafec5114c778a641cced21\``);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`blogId\` \`blogId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_19c3cafec5114c778a641cced21\` FOREIGN KEY (\`blogId\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_19c3cafec5114c778a641cced21\``);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`blogId\` \`blogId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_19c3cafec5114c778a641cced21\` FOREIGN KEY (\`blogId\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
