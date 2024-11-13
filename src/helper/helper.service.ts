import { Injectable } from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { IFav, IFavResponse } from 'src/interfaces';
import { TrackService } from 'src/tracks/tracks.service';

@Injectable()
export class HelperService {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
  ) {}

  async createFavGroups(methodName: string) {
    return {
      track: {
        group: 'track',
        field: 'tracks',
        method: (id: string) => this.trackService[methodName](id),
      },
      album: {
        group: 'album',
        field: 'albums',
        method: (id: string) => this.albumsService[methodName](id),
      },
      artist: {
        group: 'artist',
        field: 'artists',
        method: (id: string) => this.artistsService[methodName](id),
      },
    };
  }

  async getFavs(favs: IFav) {
    // const favs: IFavResponse = {
    //   artists: [],
    //   albums: [],
    //   tracks: [],
    // };

    // the way with promise all
    // async function fetchItemsByIds(
    //   ids: string[],
    //   service: any,
    // ): Promise<any[]> {
    //   return Promise.all(ids.map((id) => service.getItemById(id)));
    // }

    // [favs.artists, favs.albums, favs.tracks] = await Promise.all([
    //   fetchItemsByIds(favDB.artists, this.artistsService),
    //   fetchItemsByIds(favDB.albums, this.albumsService),
    //   fetchItemsByIds(favDB.tracks, this.trackService),
    // ]);

    // Fetch all artists in parallel
    const artists = await Promise.all(
      favs.artists.map((id) => this.artistsService.getItemById(id)),
    );

    // Fetch all albums in parallel
    const albums = await Promise.all(
      favs.albums.map((id) => this.albumsService.getItemById(id)),
    );

    // Fetch all tracks in parallel
    const tracks = await Promise.all(
      favs.tracks.map((id) => this.trackService.getItemById(id)),
    );
    // Construct the response
    const response: IFavResponse = {
      artists,
      albums,
      tracks,
    };

    return response;

    // for (const id of favsDb.artists) {
    //   const artist = await this.artistsService.getItemById(id);
    //   favs.artists.push(artist);
    // }

    // for (const id of favsDb.albums) {
    //   const album = await this.albumsService.getItemById(id);
    //   favs.albums.push(album);
    // }

    // for (const id of favsDb.tracks) {
    //   const track = await this.trackService.getItemById(id);
    //   favs.tracks.push(track);
    // }
  }
}
