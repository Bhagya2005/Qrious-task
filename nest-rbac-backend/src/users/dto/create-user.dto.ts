import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "Name of the user",
    example: "Bhagya Patel",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Email address of the user",
    example: "bhagya@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password (min 6 characters)",
    example: "password123",
    minLength: 6,
  })
  @MinLength(6)
  password: string;
  
}