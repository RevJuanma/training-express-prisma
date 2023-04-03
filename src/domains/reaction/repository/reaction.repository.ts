import { CreateReactionDTO, ReactionDTO } from "../dto";

export interface ReactionRepository {
  create(userId: string, postId: string, data: CreateReactionDTO): Promise<ReactionDTO>;
  delete(userId: string, postId: string, data: CreateReactionDTO): Promise<void>;

  getReactions(): Promise<ReactionDTO[]>
  getRetweetsByUser(userId: string): Promise<ReactionDTO[]>
  getLikesByUser(userId: string): Promise<ReactionDTO[]>
}