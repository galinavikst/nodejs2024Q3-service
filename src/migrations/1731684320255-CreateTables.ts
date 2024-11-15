import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTables1731684320255 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'string',
            isPrimary: true,
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'login',
            type: 'string',
          },
          {
            name: 'password',
            type: 'string',
          },
          {
            name: 'version',
            type: 'number',
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
            type: 'string',
            isPrimary: true,
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'artistId',
            type: 'string',
            isNullable: true,
          },
          {
            name: 'albumId',
            type: 'string',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'number',
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
            type: 'string',
            isPrimary: true,
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'string',
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
            type: 'string',
            isPrimary: true,
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'year',
            type: 'number',
          },
          {
            name: 'artistId',
            type: 'string',
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
