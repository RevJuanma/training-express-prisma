import { Post, PrismaClient } from '@prisma/client';

import { CursorPagination } from '@types';
import { NotFoundException } from '@utils';

import { PostRepository } from '.';
import { CreatePostInputDTO, PostDTO } from '../dto';

export class PostRepositoryImpl implements PostRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data,
      },
    });
    return new PostDTO(post);
  }

  async getAllByDatePaginated(userId: string): Promise<PostDTO[]> {
    const post = await this.db.post.findMany({
      where: {
        OR: [
          { author: { private: false } },
          {
            AND: [{ author: { private: true } }, { author: { followers: { some: { followerId: userId } } } }],
          },
        ],
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: 10,
    });

    return post;
  }

  async delete(postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async getByIdDelete(postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
    });
    return post ? new PostDTO(post) : null;
  }

  async getById(userId: string, postId: string): Promise<any | null> {
    const post = await this.db.post.findMany({
      where: {
        id: postId,
        OR: [
          { author: { private: false } },
          {
            AND: [{ author: { private: true } }, { author: { followers: { some: { followerId: userId } } } }],
          },
        ],
      },
      select: {
        id: true,
        authorId: true,
        content: true,
        images: true,
        createdAt: true,
        parentId: true,
        author: {
          select: {
            profileImage: true,
          },
        },
        comments: {
          select: {
            id: true,
            authorId: true,
            content: true,
            images: true,
            createdAt: true,
            reactions: {
              select: {
                id: true,
                type: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            reactions: {
              _count: 'desc',
            },
          },
          take: 10,
        },
      },
    });

    //consultar optimizacion
    // if (post?.author.private === false && !post.author.followers.some((follower) => follower.followerId === userId)) {
    //   throw new NotFoundException();
    // }

    return post ? post[0] : null;
  }

  async getByAuthorId(userId: string, authorId: string, options: CursorPagination): Promise<PostDTO[]> {
    const post = await this.db.post.findMany({
      where: {
        OR: [
          { authorId, author: { private: false } },
          {
            AND: [{ author: { private: true } }, { author: { followers: { some: { followerId: userId } } } }],
          },
        ],
      },
      // ...(options.after || options.before) && {cursor: {
      //   id: options.after ? options.after : options.before
      // }},
      cursor:
        options.after || options.before
          ? {
              id: options.after ? options.after : options.before,
            }
          : undefined,
    });
    if (post.length === 0) {
      throw new NotFoundException('posts');
    } else {
      return post;
    }
  }

  async getCommentsByUser(userId: string): Promise<PostDTO[]> {
    const comments = await this.db.post.findMany({
      where: {
        authorId: userId,
        parentId: { not: null },
      },
    });

    return comments.map((comment) => new PostDTO(comment));
  }
}
