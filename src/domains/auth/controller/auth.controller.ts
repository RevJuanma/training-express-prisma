import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import "express-async-errors";

import { db, BodyValidation } from '@utils';
import { UserRepositoryImpl } from '@domains/user/repository';

import { AuthService, AuthServiceImpl } from '../service';
import { LoginInputDTO, SignupInputDTO } from '../dto';

export const authRouter = Router();

// Use dependency injection
const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db));

/**
 * @swagger
 * /auth/signup/:
 *   post:
 *     summary: Register User
 *     tags: [Auth]
 *     description: Register User
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SignupInputDTO'
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User Not Found
 */
authRouter.post('/signup', BodyValidation(SignupInputDTO), async (req: Request, res: Response) => {
  const data = req.body;

  const token = await service.signup(data);

  return res.status(HttpStatus.CREATED).json(token);
});

/**
 * @swagger
 * /auth/login/:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     description: Login User
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginInputDTO'
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User Not Found
 */
authRouter.post('/login', BodyValidation(LoginInputDTO), async (req: Request, res: Response) => {
  const data = req.body;

  const token = await service.login(data);

  return res.status(HttpStatus.OK).json(token);
});
