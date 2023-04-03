import { Request, Response, Router } from 'express';
import "express-async-errors";
import { db } from '@utils';
import { FollowService } from '../service/follow.service';
import { FollowServiceImpl } from '../service/follow.service.impl';
import { FollowRepositoryImpl } from '../repository/follow.repository.impl';
import httpStatus from 'http-status';

export const followRouter = Router();

// Use dependency injection
const service: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db));

/**
 * @swagger
 * /follow/follows/:
 *   get:
 *     summary: Get User Follows
 *     tags: [Follows]
 *     description: Get follows by Authenticated User UUID
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FollowDTO'  
 *            example:
 *              - id: "uuid string"
 *                followedId: "uuid string"
 *                followerId: "uuid string"
 *       404:
 *         description: User Not Found
 */
followRouter.get('/follows/', async (req: Request, res: Response) => {
    const { userId } = res.locals.context;
    const { limit, skip } = req.query as Record<string, string>;

    const follows = await service.getUserFollows(userId, { limit: Number(limit), skip: Number(skip) });

    return res.status(httpStatus.OK).json(follows);
});

/**
 *  @swagger
 *  /follow/follow/{userId}:
 *      post:
 *          summary: Follow User by Id
 *          tags: [Follows]
 *          description: Follow User by UUID from Authenticated User
 *          parameters:
 *              - name: userId
 *                in: path
 *                description: UUID from Post.
 *                required: true
 *                schema:
 *                    type: string
 *          responses:
 *              200:
 *                 description: Success.
 *                 content:
 *                  application/json:
 *                    schema:
 *                      $ref: '#/components/schemas/FollowDTO'  
 *                    example:
 *                      id: "uuid string"
 *                      followedId: "uuid string"
 *                      followerId: "uuid string"
 *              404:
 *                  description: User Not Found
 */
followRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { user_id: followedId } = req.params;

    const follow = await service.createFollow(followedId, userId);
    return res.status(httpStatus.CREATED).json(follow);
});

/**
 *  @swagger
 *  /follow/unfollow/{userId}:
 *      post:
 *          summary: UnFollow User by Id
 *          tags: [Follows]
 *          description: UnFollow User by UUID from Authenticated User
 *          parameters:
 *              - name: userId
 *                in: path
 *                description: UUID from Post.
 *                required: true
 *                schema:
 *                    type: string
 *          responses:
 *              200:
 *                  description: Success
 *              404:
 *                  description: User Not Found
 */
followRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
    const { userId } = res.locals.context
    const { user_id: followedId } = req.params;

    const unfollow = await service.deleteFollow(followedId, userId);
    return res.status(httpStatus.OK).json(unfollow);
});