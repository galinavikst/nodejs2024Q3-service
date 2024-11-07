import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty()
  @IsNotEmpty() // required -> 400 bad request if empty or undefined
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174002',
    nullable: true,
  })
  @IsOptional()
  artistId: string | null; // refers to Artist

  @ApiPropertyOptional({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174002',
    nullable: true,
  })
  @IsOptional()
  albumId: string | null; // refers to Album

  @ApiProperty({
    type: Number,
    example: 200,
    description: 'Duration of the track in seconds',
  })
  @IsNotEmpty()
  @IsInt()
  duration: number; // integer number
}

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}
