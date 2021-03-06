import {MigrationInterface, QueryRunner} from "typeorm";

export class MigrationTests1644532397761 implements MigrationInterface {
    name = 'MigrationTests1644532397761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("username" varchar(20) PRIMARY KEY NOT NULL, "nome" varchar(30) NOT NULL, "cpf" varchar(11) NOT NULL, "idade" integer, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "project" ("uid" varchar PRIMARY KEY NOT NULL, "name" varchar(30) NOT NULL, "description" varchar(30) NOT NULL, "startDate" datetime, "endDate" datetime, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "username" varchar(20))`);
        await queryRunner.query(`CREATE TABLE "impediment" ("uid" varchar PRIMARY KEY NOT NULL, "name" varchar(50) NOT NULL, "description" varchar(50) NOT NULL, "active" boolean NOT NULL, "project_uid" varchar)`);
        await queryRunner.query(`CREATE TABLE "profile" ("username" varchar PRIMARY KEY NOT NULL, "password" varchar(100) NOT NULL, "avatarUrl" varchar(120), "phone" integer, CONSTRAINT "REL_d80b94dc62f7467403009d8806" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "temporary_project" ("uid" varchar PRIMARY KEY NOT NULL, "name" varchar(30) NOT NULL, "description" varchar(30) NOT NULL, "startDate" datetime, "endDate" datetime, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "username" varchar(20), CONSTRAINT "FK_c2b460c69608b861ee8de1a2f96" FOREIGN KEY ("username") REFERENCES "user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project"("uid", "name", "description", "startDate", "endDate", "created_at", "username") SELECT "uid", "name", "description", "startDate", "endDate", "created_at", "username" FROM "project"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`ALTER TABLE "temporary_project" RENAME TO "project"`);
        await queryRunner.query(`CREATE TABLE "temporary_impediment" ("uid" varchar PRIMARY KEY NOT NULL, "name" varchar(50) NOT NULL, "description" varchar(50) NOT NULL, "active" boolean NOT NULL, "project_uid" varchar, CONSTRAINT "FK_3dc68ee26532bcc241280246a8e" FOREIGN KEY ("project_uid") REFERENCES "project" ("uid") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_impediment"("uid", "name", "description", "active", "project_uid") SELECT "uid", "name", "description", "active", "project_uid" FROM "impediment"`);
        await queryRunner.query(`DROP TABLE "impediment"`);
        await queryRunner.query(`ALTER TABLE "temporary_impediment" RENAME TO "impediment"`);
        await queryRunner.query(`CREATE TABLE "temporary_profile" ("username" varchar PRIMARY KEY NOT NULL, "password" varchar(100) NOT NULL, "avatarUrl" varchar(120), "phone" integer, CONSTRAINT "REL_d80b94dc62f7467403009d8806" UNIQUE ("username"), CONSTRAINT "FK_d80b94dc62f7467403009d88062" FOREIGN KEY ("username") REFERENCES "user" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_profile"("username", "password", "avatarUrl", "phone") SELECT "username", "password", "avatarUrl", "phone" FROM "profile"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`ALTER TABLE "temporary_profile" RENAME TO "profile"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" RENAME TO "temporary_profile"`);
        await queryRunner.query(`CREATE TABLE "profile" ("username" varchar PRIMARY KEY NOT NULL, "password" varchar(100) NOT NULL, "avatarUrl" varchar(120), "phone" integer, CONSTRAINT "REL_d80b94dc62f7467403009d8806" UNIQUE ("username"))`);
        await queryRunner.query(`INSERT INTO "profile"("username", "password", "avatarUrl", "phone") SELECT "username", "password", "avatarUrl", "phone" FROM "temporary_profile"`);
        await queryRunner.query(`DROP TABLE "temporary_profile"`);
        await queryRunner.query(`ALTER TABLE "impediment" RENAME TO "temporary_impediment"`);
        await queryRunner.query(`CREATE TABLE "impediment" ("uid" varchar PRIMARY KEY NOT NULL, "name" varchar(50) NOT NULL, "description" varchar(50) NOT NULL, "active" boolean NOT NULL, "project_uid" varchar)`);
        await queryRunner.query(`INSERT INTO "impediment"("uid", "name", "description", "active", "project_uid") SELECT "uid", "name", "description", "active", "project_uid" FROM "temporary_impediment"`);
        await queryRunner.query(`DROP TABLE "temporary_impediment"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME TO "temporary_project"`);
        await queryRunner.query(`CREATE TABLE "project" ("uid" varchar PRIMARY KEY NOT NULL, "name" varchar(30) NOT NULL, "description" varchar(30) NOT NULL, "startDate" datetime, "endDate" datetime, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "username" varchar(20))`);
        await queryRunner.query(`INSERT INTO "project"("uid", "name", "description", "startDate", "endDate", "created_at", "username") SELECT "uid", "name", "description", "startDate", "endDate", "created_at", "username" FROM "temporary_project"`);
        await queryRunner.query(`DROP TABLE "temporary_project"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "impediment"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
