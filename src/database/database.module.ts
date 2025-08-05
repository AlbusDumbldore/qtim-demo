import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...appConfig.postgres,
      type: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
  ],
})
export class DatabaseModule {}
