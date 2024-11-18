import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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
  @IsUUID()
  artistId: string | null; // refers to Artist
}

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}
