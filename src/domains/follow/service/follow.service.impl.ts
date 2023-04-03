import { OffsetPagination } from '@types';
import { FollowDTO } from '../dto';
import { FollowRepository } from '../repository/follow.repository';
import { FollowService } from './follow.service';

export class FollowServiceImpl implements FollowService {
  constructor(private readonly repository: FollowRepository) {}

  getUserFollows(userId: any, options: OffsetPagination): Promise<FollowDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return this.repository.getUserFollowsPaginated(userId, options);
  }

  createFollow(userId: string, followerId: string): Promise<FollowDTO> {
    return this.repository.create(userId, followerId);
  }

  deleteFollow(userId: string, followerId: string): Promise<void> {
    return this.repository.delete(userId, followerId);
  }

  async getValidateFollowing(userId: string, followedId: string): Promise<Boolean> {
    const validate = await this.repository.getFollowingValidate(userId, followedId);

    return validate;
  }
}
