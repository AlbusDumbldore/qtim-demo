import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArticleTable1754373986927 implements MigrationInterface {
  name = 'CreateArticleTable1754373986927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "article" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "article"`);
  }
}
