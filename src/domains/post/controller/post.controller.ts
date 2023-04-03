import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db, BodyValidation } from '@utils';

import { PostRepositoryImpl } from '../repository';
import { PostService, PostServiceImpl } from '../service';
import { CreatePostInputDTO } from '../dto';


export const postRouter = Router();

// Use dependency injection
const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db));

/**
 * @openapi
 *   tags:
 *   name: Posts 
 */

/**
* @swagger
*  /post/:
*  get:
*     summary: Get Posts
*     tags: [Posts]
*     description: Get Latest Post
*     responses:
*       200:
*         description: Success
*         content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/PostDTO'  
*            example:
*              - id: "uuid string"
*                authorId: "uuid string"
*                content: "uuid string"
*                images: [ ]
*                createdAt: "2023-03-07T19:45:28.377Z"
*                updatedAt: "2023-03-07T19:45:28.377Z"
*                deletedAt: null
*                parentId: null
*  post:
*     summary: Create post
*     description: Create post from authenticated User
*     tags: [Posts]
*     requestBody:
*       required: true
*       content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/PostDTO'
*     responses:
*       200:
*         description: Success
*         content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/PostDTO'  
*            example:
*                id: "uuid string"
*                authorId: "uuid string"
*                content: "uuid string"
*                images: []
*                createdAt: "2023-03-07T19:45:28.377Z"
*                parentId: null
*/
postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { limit, before, after } = req.query as Record<string, string>;

  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after });

  return res.status(HttpStatus.OK).json(posts);
});

postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const data = req.body;

  const post = await service.createPost(userId, data);

  return res.status(HttpStatus.CREATED).json(post);
});

/**
* @swagger
*  /post/{postId}:
*  get:
*     summary: Get Post by ID
*     tags: [Posts]
*     description: Get post by UUID
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
*         schema:
*         type: json
*  delete:
*     summary: Delete Post by ID
*     tags: [Posts]
*     description: Delete post by Post ID
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
*         schema:
*         type: json 
*/
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;

  const post = await service.getPost(userId, postId);

  return res.status(HttpStatus.OK).json(post);
});

postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { postId } = req.params;

  await service.deletePost(userId, postId);

  return res.status(HttpStatus.OK);
});

/**
* @swagger
*  /post/by_user/{userId}:
*  get:
*     summary: Get Posts by User ID
*     tags: [Posts]
*     description: Get post by UUiD from User
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
*         content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/PostDTO'  
*            example:
*              - id: "uuid string"
*                followedId: "uuid string"
*                followerId: "uuid string"
*/
postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  const { userId: authorId } = req.params;
  const { limit, before, after } = req.query as Record<string, string>;

  const posts = await service.getPostsByAuthor(userId, authorId, { limit: Number(limit), before, after });

  return res.status(HttpStatus.OK).json(posts);
});

/**
* @swagger
*  /post/comments/{userId}:
*  get:
*     summary: Get Comments by User ID
*     tags: [Comments]
*     description: Get comments by UUID from User
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
*         schema:
*         type: json
*/
postRouter.get('/comments/:user_id', async (req: Request, res: Response) => {
  const { user_id } = req.params;

  const comments = await service.getUserComments(user_id);

  return res.status(HttpStatus.OK).json(comments);
});
