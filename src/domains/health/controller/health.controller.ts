import { Request, Response, Router } from 'express';
import HttpStatus from 'http-status';
import 'express-async-errors';

export const healthRouter = Router();

/**
 *  @swagger
 *  /health/:
 *      get:
 *          summary: Server Health
 *          tags: [Health]
 *          description: Check server health
 *          responses:
 *              200:
 *                  description: Success
 */
healthRouter.get('/', (req: Request, res: Response) => {
  return res.status(HttpStatus.OK).send();
});
