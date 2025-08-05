import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddArticleUserRelation1754374189675 implements MigrationInterface {
  name = 'AddArticleUserRelation1754374189675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "article" ADD "user_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_fae0bad5f06a58f3d2b68e37f11" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_fae0bad5f06a58f3d2b68e37f11"`);
    await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "user_id"`);
  }
}
