import { OffsetPagination } from '@types';
import { FollowDTO } from '../dto';

export interface FollowRepository {
  getUserFollowsPaginated(userId: string, options: OffsetPagination): Promise<FollowDTO[]>;
  create(userId: string, followerId: string): Promise<FollowDTO>;
  delete(userId: string, followerId: string): Promise<void>;
  getFollowingValidate(userId: string, followedId: string): Promise<Boolean>;
}
