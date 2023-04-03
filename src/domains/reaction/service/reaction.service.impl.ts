import { CreateReactionDTO, ReactionDTO } from "../dto";
import { validate } from 'class-validator';
import { ReactionRepository } from "../repository";
import { ReactionService } from "./reaction.service";

export class ReactionServiceImpl implements ReactionService {
    constructor(private readonly repository: ReactionRepository) { }

    getAllReactions(): Promise<ReactionDTO[]> {
        return this.repository.getReactions();
    }
    
    getUserRetweets(userId: string): Promise<ReactionDTO[]> {
        return this.repository.getRetweetsByUser(userId);
    }
    getUserLikes(userId: string): Promise<ReactionDTO[]> {
        return this.repository.getLikesByUser(userId);
    }

    createReaction(userId: string, postId: string, data: CreateReactionDTO): Promise<ReactionDTO> {
        validate(data);
        return this.repository.create(userId, postId, data);
    }

    async deleteReaction(userId: string, postId: string, data: CreateReactionDTO): Promise<void> {
        // crear una validacion, si el post sigue existiendo eliminar reaction, sino tirar un forbiden
        return this.repository.delete(userId, postId, data);
    }
}  