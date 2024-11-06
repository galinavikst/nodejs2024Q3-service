import { ITrack, IUser } from './interfaces';

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

  update(newUser: IUser) {
    this.usersDb[newUser.id] = newUser;
    return this.usersDb[newUser.id];
  }

  delete(id: string) {
    const deletedUser = this.usersDb[id];
    delete this.usersDb[id];
    return deletedUser;
  }
}

export class TracksRepo {
  private tracksDb: Record<string, ITrack> = {};

  findAll() {
    return this.tracksDb;
  }

  save(track: ITrack) {
    this.tracksDb[track.id] = track;
  }

  getById(id: string) {
    return this.tracksDb[id];
  }

  update(updatedTrack: ITrack) {
    this.tracksDb[updatedTrack.id] = updatedTrack;
    return this.tracksDb[updatedTrack.id];
  }

  delete(id: string) {
    const deletedTrack = this.tracksDb[id];
    delete this.tracksDb[id];
    return deletedTrack;
  }
}

export const albumsDB = {};
export const artistsDB = {};
export const favoritesDB = {};
