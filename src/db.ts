import { IUser } from './interfaces';

export class UserRepo {
  private usersDb: Record<string, IUser> = {};

  findAll() {
    return this.usersDb;
  }

  save(user: IUser) {
    this.usersDb[user.id] = user;
  }

  getById(id: string) {
    return this.usersDb[id];
  }
}

// export const usersDB = {
//   testUser: {
//     id: 'uuid',
//     login: 'login',
//     password: 'password',
//     version: 1,
//     createdAt: 123456,
//     updatedAt: 456123,
//   },
// };

export const albumsDB = {};
export const artistsDB = {};
export const favoritesDB = {};
export const tracksDB = {};
