import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UserDTO {

  constructor(user: UserDTO) {
    this.id = user.id;
    this.name = user.name;
    this.createdAt = user.createdAt;
  }

  id: string;
  name: string | null;
  createdAt: Date;
}

export class ExtendedUserDTO extends UserDTO {

  constructor(user: ExtendedUserDTO) {
    super(user)
    this.email = user.email;
    this.password = user.password;
    this.private = user.private;
    this.profileImage = user.profileImage;
  }

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  private: boolean;

  @IsString()
  @IsOptional()
  profileImage?: string | null;
}
