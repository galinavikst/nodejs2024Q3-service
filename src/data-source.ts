// import 'reflect-metadata'; // typeorm
// import { DataSource } from 'typeorm';
// import { User } from './users/user.model';

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 8080, // postgres post / default 5432 but i installed with 8080
//   username: 'postgres', // postgres default name
//   password: 'halynavs89', // postgres pass when registered
//   database: 'postgres',
//   synchronize: true,
//   logging: true,
//   entities: [User],
//   subscribers: [],
//   migrations: [],
// });

// AppDataSource.initialize()
//   .then(() => {
//     console.log('hello db');

//     // here you can start to work with your database
//   })
//   .catch((error) => console.log('data-source', error));
