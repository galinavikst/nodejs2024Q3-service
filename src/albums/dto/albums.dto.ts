import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAlbumDto {
  id: string; // uuid v4

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsOptional()
  artistId: string | null; // refers to Artist
}

export class UpdateAlbumDto extends PartialType(GetAlbumDto) {}
