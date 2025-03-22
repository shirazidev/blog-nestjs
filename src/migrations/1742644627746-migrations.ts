import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { EntityNames } from '../common/enums/entity.enum';
import { Roles } from '../common/enums/role.enum';
import { UserStatus } from '../modules/user/enums/status.enum';

export class Migrations1742644627746 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityNames.User,
        columns: [
          { name: 'id', isPrimary: true, type: 'serial', isNullable: false },
          {
            name: 'username',
            type: 'character varying(50)',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'character varying(12)',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'new_phone',
            type: 'character varying(12)',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'verify_phone',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            name: 'email',
            type: 'character varying(100)',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'verify_email',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            name: 'new_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'role',
            type: 'enum',
            enum: [Roles.User, Roles.Admin],
          },
          {
            name: 'status',
            type: 'enum',
            enum: [UserStatus.Ban, UserStatus.Report, UserStatus.Normal],
          },
          {
            name: 'password',
            type: 'character varying(255)',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EntityNames.User, true);
  }
}
