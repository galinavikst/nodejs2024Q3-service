import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
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

export class CreateAlbumDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  //@IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  artistId: string | null; // refers to Artist
}

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}
