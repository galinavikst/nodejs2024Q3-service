import { IAlbum, IArtist, ITrack, IUser } from './interfaces';

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

export class AlbumsRepo {
  private albumsDB: Record<string, IAlbum> = {};

  findAll() {
    return this.albumsDB;
  }

  save(album: IAlbum) {
    this.albumsDB[album.id] = album;
  }

  getById(id: string) {
    return this.albumsDB[id];
  }

  update(updatedAlbum: IAlbum) {
    this.albumsDB[updatedAlbum.id] = updatedAlbum;
    return this.albumsDB[updatedAlbum.id];
  }

  delete(id: string) {
    const deletedTrack = this.albumsDB[id];
    delete this.albumsDB[id];
    return deletedTrack;
  }
}

export class ArtistsRepo {
  private artistsDB: Record<string, IArtist> = {};

  findAll() {
    return this.artistsDB;
  }

  save(artist: IArtist) {
    this.artistsDB[artist.id] = artist;
  }

  getById(id: string) {
    return this.artistsDB[id];
  }

  update(newArtist: IArtist) {
    this.artistsDB[newArtist.id] = newArtist;
    return this.artistsDB[newArtist.id];
  }

  delete(id: string) {
    const deletedArtist = this.artistsDB[id];
    delete this.artistsDB[id];
    return deletedArtist;
  }
}

export const favoritesDB = {};
