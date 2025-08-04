import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../config';

const typeormModule = TypeOrmModule.forRoot({
  ...appConfig.postgres,
  type: 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
});

@Global()
@Module({
  imports: [typeormModule],
  exports: [typeormModule],
})
export class DatabaseModule {}
