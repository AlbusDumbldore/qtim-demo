import * as path from 'node:path';
import { DataSource } from 'typeorm';
import appConfig from '../config';

// This const is not "unused", it's used for migrations
export const datasource = new DataSource({
  ...appConfig.postgres,
  type: 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [path.join(__dirname, './**/migrations/*.{ts,js}')],
});
