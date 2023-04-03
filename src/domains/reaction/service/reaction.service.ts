import { CreateReactionDTO, ReactionDTO } from "../dto";

export interface ReactionService {
  getAllReactions(): Promise<ReactionDTO[]>
  
  createReaction(userId: string, postId: string, body: CreateReactionDTO): Promise<ReactionDTO>;
  deleteReaction(userId: string, postId: string, body: CreateReactionDTO): Promise<void>;
  
  getUserRetweets(userId: string): Promise<ReactionDTO[]>
  getUserLikes(userId: string): Promise<ReactionDTO[]>
}