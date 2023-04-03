import { PrismaClient } from '@prisma/client';
import { OffsetPagination } from '@types';
import { FollowDTO } from '../dto';
import { FollowRepository } from './follow.repository';

export class FollowRepositoryImpl implements FollowRepository {
  constructor(private readonly db: PrismaClient) {}

  async getUserFollowsPaginated(userId: string, options: OffsetPagination): Promise<FollowDTO[]> {
    const follows = await this.db.follow.findMany({
      where: {
        followerId: userId,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
    return follows.map((follow) => new FollowDTO(follow));
  }

  async create(userId: string, followerId: string): Promise<FollowDTO> {
    const follow = await this.db.follow.create({
      data: {
        followedId: userId,
        followerId,
      },
    });
    return new FollowDTO(follow);
  }

  async delete(userId: string, followerId: string): Promise<void> {
    await this.db.follow.deleteMany({
      where: {
        followerId,
        followedId: userId,
      },
    });
  }

  async getFollowingValidate(followerId: string, followedId: string): Promise<Boolean> {
    const follow = await this.db.follow.findMany({
      where: {
        OR: [
          {
            followerId,
            followedId,
          },
          {
            followerId: followedId,
            followedId: followerId,
          },
        ],
      },
    });

    return follow.length > 1 ? true : false;
  }
}
