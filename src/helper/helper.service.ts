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
    // Fetch data in parallel
    const artists = await Promise.all(
      favs.artists.map(async (id) => await this.artistsService.getItemById(id)),
    );

    const albums = await Promise.all(
      favs.albums.map((id) => this.albumsService.getItemById(id)),
    );

    const tracks = await Promise.all(
      favs.tracks.map((id) => this.trackService.getItemById(id)),
    );

    const response: IFavResponse = {
      artists: artists.filter(Boolean),
      albums: albums.filter(Boolean),
      tracks: tracks.filter(Boolean),
    };

    return response;
  }
}
