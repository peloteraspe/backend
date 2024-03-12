import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProfile {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 3])
  level_id: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsIn([1, 2, 3, 4, 5], { each: true })
  @IsInt({ each: true })
  player_position: number[];
}
