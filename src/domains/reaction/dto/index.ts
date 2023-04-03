import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateReactionDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    type!: string;
  }

export class ReactionDTO {

    constructor(reaction: ReactionDTO) {
        this.id = reaction.id;
        this.type = reaction.type
        this.authorId = reaction.authorId;
        this.postId = reaction.postId;
    }

    id: string;

    @IsString()
    type: string;
    authorId: string;
    postId: string;
}