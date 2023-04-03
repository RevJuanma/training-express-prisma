import { BodyValidation, db } from "@utils";
import { Request, Response, Router } from "express";
import httpStatus from "http-status";
import { CreateReactionDTO } from "../dto";
import { ReactionRepositoryImpl } from "../repository";
import { ReactionService, ReactionServiceImpl } from "../service";

export const reactionRouter = Router();

const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db));

/**
 * @openapi
 *   tags:
 *   name: Reactions
 */

/**
 * @swagger
 * /reaction/:
 *   get:
 *     summary: Get Reactions
 *     tags: [Reactions]
 *     description: Get all reactions.
 *      requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReactionDTO'
 *     responses:
 *       200:
 *         description: Success
 */
reactionRouter.get('/', async (req: Request, res: Response) => {
    const reactions = await service.getAllReactions();

    return res.status(httpStatus.OK).json(reactions);
});

/**
 * @swagger
 * /reaction/{postId}:
 *   post:
 *     summary: Create Reaction
 *     tags: [Reactions]
 *     description: Create Reaction by Post UUID from Authenticated User
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: UUID from Post.
 *         required: true   
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReactionDTO'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReactionDTO'  
 *            example:
 *              id: 20 
 *   delete:
 *     summary: Get Reactions
 *     tags: [Reactions]
 *     description: Get all reactions.
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: UUID from Post.
 *         required: true   
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
reactionRouter.post('/:post_id', BodyValidation(CreateReactionDTO), async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { post_id } = req.params;
    const data = req.body;

    const reaction = await service.createReaction(userId, post_id, data);
    return res.status(httpStatus.CREATED).json(reaction);
});

reactionRouter.delete('/:post_id', BodyValidation(CreateReactionDTO), async (req: Request, res: Response) => {
    const { userId } = res.locals.context;
    const { postId } = req.params;
    const data = req.body;

    await service.deleteReaction(userId, postId, data);

    return res.status(httpStatus.OK);
});


/**
 * @swagger
 * /retweets/{userId}:
 *   get:
 *     summary: Get Retweets
 *     tags: [Reactions]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: UUID from User.
 *         required: true
 *         schema:
 *           type: string
 *     description: Get retweets by UUID User
 *     responses:
 *       200:
 *         description: Success
 */
reactionRouter.get('/retweets/:user_id', async (req: Request, res: Response) => {
    const { user_id } = req.params;

    const reactions = await service.getUserRetweets(user_id);

    return res.status(httpStatus.OK).json(reactions);
});

/**
 * @swagger
 * /likes/{userId}:
 *   get:
 *     summary: Get Likes
 *     tags: [Reactions]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: UUID from User.
 *         required: true
 *         schema:
 *           type: string
 *     description: Get likes by UUID User
 *     responses:
 *       200:
 *         description: Success
 */
reactionRouter.get('/likes/:user_id', async (req: Request, res: Response) => {
    const { user_id } = req.params;

    const reactions = await service.getUserLikes(user_id);

    return res.status(httpStatus.OK).json(reactions);
});