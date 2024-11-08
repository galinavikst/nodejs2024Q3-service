import { IAlbum, IArtist, ITrack, IUser } from './interfaces';

class Repo<T> {
  protected db: Record<string, T> = {};

  findAll(): Record<string, T> {
    return this.db;
  }

  save(item: T & { id: string }): void {
    this.db[item.id] = item;
  }

  getById(id: string): T {
    return this.db[id];
  }

  update(item: T & { id: string }): T {
    this.db[item.id] = item;
    return this.db[item.id];
  }

  delete(id: string): T {
    const deletedItem = this.db[id];
    delete this.db[id];
    return deletedItem;
  }
}

export class UserRepo extends Repo<IUser> {}
export class AlbumsRepo extends Repo<IAlbum> {}
export class ArtistsRepo extends Repo<IArtist> {}
export class TracksRepo extends Repo<ITrack> {}

export class FavRepo {
  private favDB: Record<string, string[]> = {
    artists: [],
    albums: [],
    tracks: [],
  };

  findAll(): Record<string, string[]> {
    return this.favDB;
  }

  save(key: string, id: string): void {
    this.favDB[key].push(id);
  }

  delete(key: string, id: string): void {
    const idsArr = this.favDB[key];
    const filtered = idsArr.filter((item) => item !== id);
    this.favDB[key] = filtered;
  }
}
