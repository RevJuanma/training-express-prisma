import { CursorPagination } from '@types';
import { CreatePostInputDTO, PostDTO } from '../dto';

export interface PostRepository {
  create(userId: string, data: CreatePostInputDTO): Promise<PostDTO>;
  getAllByDatePaginated(userId: string, options: CursorPagination): Promise<PostDTO[]>;
  delete(postId: string): Promise<void>;
  getByIdDelete(postId: string): Promise<PostDTO | null>;
  getById(userId: string, postId: string): Promise<PostDTO | null>;
  getByAuthorId(userId: string, authorId: string, options: CursorPagination): Promise<PostDTO[]>;

  getCommentsByUser(userId: string): Promise<PostDTO[]>;
}
