import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTables1731684320255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'login',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'version',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'track',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'artistId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'albumId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'int',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'fav',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isUnique: true,
            isGenerated: true,
            generationStrategy: 'increment',
            isNullable: false,
          },
          {
            name: 'artists',
            type: 'text',
            isArray: true,
          },
          {
            name: 'albums',
            type: 'text',
            isArray: true,
          },
          {
            name: 'tracks',
            type: 'text',
            isArray: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'artist',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'grammy',
            type: 'boolean',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'album',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'year',
            type: 'int',
          },
          {
            name: 'artistId',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // correct order to remove tables with relations
    await queryRunner.dropTable('fav');
    await queryRunner.dropTable('track');
    await queryRunner.dropTable('album', true, true); // name, if exist, cascade drop
    await queryRunner.dropTable('artist', true, true);
    await queryRunner.dropTable('user');
  }
}
