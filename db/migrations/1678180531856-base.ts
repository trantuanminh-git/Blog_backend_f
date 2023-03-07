import { MigrationInterface, QueryRunner } from 'typeorm';

export class base1678180531856 implements MigrationInterface {
  name = 'base1678180531856';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` text NOT NULL, \`username\` varchar(255) NOT NULL, \`biography\` varchar(255) NULL, \`refreshToken\` varchar(255) NULL, \`roleId\` int NULL, UNIQUE INDEX \`REL_c28e52f758e7bbc53828db9219\` (\`roleId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`like\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`blogId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tag\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`blog\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT Tue Mar 07 2023 16:15:36 GMT+0700 (Indochina Time), \`updated_at\` datetime(6) NOT NULL DEFAULT Tue Mar 07 2023 16:15:36 GMT+0700 (Indochina Time) ON UPDATE CURRENT_TIMESTAMP(6), \`view\` int NOT NULL DEFAULT '0', \`likeCount\` int NOT NULL DEFAULT '0', \`cmtCount\` int NOT NULL DEFAULT '0', \`shares\` text NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, \`userId\` int NOT NULL, \`blogId\` int NOT NULL, \`parentId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`blog_tags_tag\` (\`blogId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_9572d27777384d535f77ed780d\` (\`blogId\`), INDEX \`IDX_066934a149d9efba507443ce88\` (\`tagId\`), PRIMARY KEY (\`blogId\`, \`tagId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` ADD CONSTRAINT \`FK_eff3e46d24d416b52a7e0ae4159\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` ADD CONSTRAINT \`FK_eff3e46d24d416b52a7e0ae4159\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD CONSTRAINT \`FK_fc46ede0f7ab797b7ffacb5c08d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_0b0e4bbc8415ec426f87f3a88e2\` FOREIGN KEY (\`id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_0b0e4bbc8415ec426f87f3a88e2\` FOREIGN KEY (\`id\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_0b0e4bbc8415ec426f87f3a88e2\` FOREIGN KEY (\`id\`) REFERENCES \`blog\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_0b0e4bbc8415ec426f87f3a88e2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_0b0e4bbc8415ec426f87f3a88e2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_0b0e4bbc8415ec426f87f3a88e2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`blog\` DROP FOREIGN KEY \`FK_fc46ede0f7ab797b7ffacb5c08d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_eff3e46d24d416b52a7e0ae4159\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`like\` DROP FOREIGN KEY \`FK_eff3e46d24d416b52a7e0ae4159\``,
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
    await queryRunner.query(`DROP TABLE \`comment\``);
    await queryRunner.query(`DROP TABLE \`blog\``);
    await queryRunner.query(`DROP TABLE \`tag\``);
    await queryRunner.query(`DROP TABLE \`like\``);
    await queryRunner.query(
      `DROP INDEX \`REL_c28e52f758e7bbc53828db9219\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`role\``);
  }
}
