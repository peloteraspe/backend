import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
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

export class createProfileDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  user: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  username: string;

  @IsDefined()
  @IsInt()
  @IsIn([1, 2, 3])
  level_id: number;

  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsIn([1, 2, 3, 4, 5], { each: true })
  @IsInt({ each: true })
  player_position: number[];
}
