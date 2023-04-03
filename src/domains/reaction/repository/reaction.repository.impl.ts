import { PrismaClient } from "@prisma/client";
import { NotFoundException } from "@utils";
import { CreateReactionDTO, ReactionDTO } from "../dto";
import { ReactionRepository } from "./reaction.repository";

export class ReactionRepositoryImpl implements ReactionRepository {
    constructor(private readonly db: PrismaClient) { }

    async create(userId: string, postId: string, data: CreateReactionDTO): Promise<ReactionDTO> {
        const post = await this.db.reaction.create({
            data: {
                authorId: userId,
                postId,
                ...data
            },
        });
        return new ReactionDTO(post);
    }

    async delete(userId: string, postId: string, data: CreateReactionDTO): Promise<void> {
        const reactions = await this.db.reaction.findMany({
            where: {
                postId,
                authorId: userId
            }
        });

        let reactionId;
        reactions.map((reaction) => {
            reaction.type === data.type && (reactionId = reaction.id)
        })

        if (reactionId) {
            await this.db.reaction.delete({
                where: {
                    id: reactionId
                }
            })
        } else {
            throw new NotFoundException();
        }
    }

    async getReactions(): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany()
        return reactions.map(reaction => new ReactionDTO(reaction));
    }

    async getRetweetsByUser(userId: string): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany({
            where: {
                type: "RT",
                authorId: userId
            }
        })

        return reactions.map(reaction => new ReactionDTO(reaction));
    }

    async getLikesByUser(userId: string): Promise<ReactionDTO[]> {
        const reactions = await this.db.reaction.findMany({
            where: {
                type: "LK",
                authorId: userId
            }
        })

        return reactions.map(reaction => new ReactionDTO(reaction));
    }
}  