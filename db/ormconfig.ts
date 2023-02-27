import { DataSource, DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1',
  database: 'Fetch_blog_nestjs_typeorm',
  //   synchronize: true,
  logging: false,
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const configOrm = new DataSource(config);
export default configOrm;
