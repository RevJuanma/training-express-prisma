import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import { db } from '@utils';
import { MessageRepositoryImpl } from '../repository/message.repository.impl';
import { MessageService } from '../service/message.service';
import { MessageServiceImpl } from '../service/message.service.impl';

export const messageRouter = Router();

// Use dependency injection
const service: MessageService = new MessageServiceImpl(new MessageRepositoryImpl(db));

/**
 * @swagger
 * /chat/:
 *   get:
 *     summary: Get Messages
 *     tags: [Chat]
 *     description: Get Messages by UUID from User
 *     parameters:
 *         - name: userId
 *           in: path
 *           description: UUID from User.
 *           required: true
 *           schema:
 *               type: string
 *     responses:
 *       200:
 *         description: Success
 */
messageRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context;
  console.log(userId);

  const messages = await service.getMessages(userId);

  return res.status(HttpStatus.OK).json(messages);
});
