import { DataSource, DataSourceOptions } from 'typeorm';
import { config as configDotenv } from 'dotenv';

configDotenv();

export const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  //   synchronize: true,
  logging: false,
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const configOrm = new DataSource(config);
export default configOrm;
