import { IsEmail, IsOptional, MinLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "Name of the user",
    example: "Bhagya Patel",
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: "Email address of the user",
    example: "bhagya@example.com",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: "Password (min 6 characters)",
    example: "password123",
    minLength: 6,
  })
  @IsOptional()
  @MinLength(6)
  password?: string;
}
