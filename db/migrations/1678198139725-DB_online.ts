import { MigrationInterface, QueryRunner } from 'typeorm';

export class DBOnline1678198139725 implements MigrationInterface {
  name = 'DBOnline1678198139725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tag\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`username\` varchar(255) NOT NULL, \`biography\` varchar(255) NULL, \`refreshToken\` varchar(255) NULL, \`roleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`blog\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT Tue Mar 07 2023 21:09:02 GMT+0700 (Indochina Time), \`updated_at\` timestamp NOT NULL DEFAULT Tue Mar 07 2023 21:09:02 GMT+0700 (Indochina Time), \`view\` int NOT NULL DEFAULT '0', \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`blog_tags_tag\` (\`blogId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_9572d27777384d535f77ed780d\` (\`blogId\`), INDEX \`IDX_066934a149d9efba507443ce88\` (\`tagId\`), PRIMARY KEY (\`blogId\`, \`tagId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_fc46ede0f7ab797b7ffacb5c08d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog_tags_tag\` ADD CONSTRAINT \`FK_9572d27777384d535f77ed780d0\` FOREIGN KEY (\`blogId\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog_tags_tag\` ADD CONSTRAINT \`FK_066934a149d9efba507443ce889\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blog_tags_tag\` DROP FOREIGN KEY \`FK_066934a149d9efba507443ce889\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog_tags_tag\` DROP FOREIGN KEY \`FK_9572d27777384d535f77ed780d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_fc46ede0f7ab797b7ffacb5c08d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_066934a149d9efba507443ce88\` ON \`blog_tags_tag\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_9572d27777384d535f77ed780d\` ON \`blog_tags_tag\``,
    );
    await queryRunner.query(`DROP TABLE \`blog_tags_tag\``);
    await queryRunner.query(`DROP TABLE \`blog\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`tag\``);
  }
}
