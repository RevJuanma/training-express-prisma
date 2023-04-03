import { IsNotEmpty, IsOptional, isString, IsString, MaxLength } from 'class-validator';

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
  content!: string;

  @IsOptional()
  @MaxLength(4)
  images?: string[];

  @IsOptional()
  parentId?: string;
}

export class PostDTO {

  constructor(post: PostDTO) {
    this.id = post.id;
    this.authorId = post.authorId;
    this.content = post.content;
    this.images = post.images;
    this.createdAt = post.createdAt;
    this.parentId = post.parentId;
  }

  id: string;
  authorId: string;

  @IsString()
  content: string;

  @IsOptional()
  images: string[];

  createdAt: Date;
  
  @IsString()
  @IsOptional()
  parentId?: string | null;
}
