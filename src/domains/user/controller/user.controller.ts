import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import 'express-async-errors';

import { db } from '@utils';
import { UserRepositoryImpl } from '../repository';
import { UserService, UserServiceImpl } from '../service';
import { BUCKET_NAME, s3 } from '@utils/aws.config';

export const userRouter = Router();

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db));

/**
 * @openapi
 *   tags:
 *   name: Users
 */

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Get Users
 *     tags: [Users]
 *     description: Get all users
 *     responses:
 *       200:
 *         description: Success
 *   delete:
 *      summary: Delete User
 *      tags: [Users]
 *      description: Delete your User.
 *      response:
 *        200:
 *          description: Success
 */
userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { limit, skip } = req.query as Record<string, string>;

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) });

  return res.status(HttpStatus.OK).json(users);
});

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  await service.deleteUser(userId);

  return res.status(HttpStatus.OK);
});

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;

  const user = await service.getUser(userId);

  return res.status(HttpStatus.OK).json(user);
});

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get User by ID
 *     tags: [Users]
 *     description: Get user by ID
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: UUID from User.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: specific user.
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ExtendedUserDTO'
 *       404:
 *         description: User Not Found
 */
userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params;

  const user = await service.getUser(otherUserId);

  return res.status(HttpStatus.OK).json(user);
});

/**
 * @swagger
 * /user/changePrivate/{userId}:
 *   patch:
 *     summary: Change private property
 *     tags: [Users]
 *     description: Change private property from User. It is changed to the opposite value of the current one.
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: UUID from User.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User Not Found
 */
userRouter.patch('/changePrivate/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await service.patchUserPrivate(userId);

  return res.status(HttpStatus.OK).json(user);
});

/**
 * @swagger
 * /user/{userId}/profile-image:
 *   patch:
 *     summary: Set profile image to User
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: UUID from User.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User Not Found
 */
userRouter.patch('/users/:userId/profile-image', async (req, res) => {
  const { userId } = req.params;
  // const type = req.body.type === 'get' ? 'getObject' : 'putObject';

  const url = await s3.getSignedUrlPromise('putObject', {
    Bucket: BUCKET_NAME,
    Key: `${req.body.key}`,
    Expires: 3600,
  });

  res.send(url);

  const user = await service.patchUserProfileImg(userId, url);

  return res.status(HttpStatus.OK).json(user);
});
