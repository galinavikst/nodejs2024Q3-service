import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class GetTrackDto {
  @IsOptional()
  @IsUUID('4') // Validates UUID v4 format
  id: string;

  @IsNotEmpty() // required -> 400 bad request if empty or undefined
  @IsString()
  name: string;

  @IsOptional()
  artistId: string | null; // refers to Artist

  @IsOptional()
  albumId: string | null; // refers to Album

  @IsNotEmpty()
  @IsInt()
  duration: number; // integer number
}

export class UpdateTrackDto extends PartialType(GetTrackDto) {} // all fiels is optional
