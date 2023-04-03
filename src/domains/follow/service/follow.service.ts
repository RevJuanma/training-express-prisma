import { OffsetPagination } from '@types';
import { FollowDTO } from '../dto';

export interface FollowService {
  getUserFollows(userId: any, options: OffsetPagination): Promise<FollowDTO[]>;
  createFollow(userId: string, followerId: string): Promise<FollowDTO>;
  deleteFollow(userId: string, followerId: string): Promise<void>;
  getValidateFollowing(userId: any, followedId: string): Promise<Boolean>;
}
