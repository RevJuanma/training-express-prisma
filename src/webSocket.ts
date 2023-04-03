import jwt from 'jsonwebtoken';
import { Constants, db } from '@utils';
import { FollowService, FollowServiceImpl } from '@domains/follow/service';
import { FollowRepositoryImpl } from '@domains/follow/repository';
import { MessageService, MessageServiceImpl } from '@domains/message/service';
import { MessageRepositoryImpl } from '@domains/message/repository';

const users = new Map<string, string>();

export const websocketRouter = (io: any) => {
  const followService: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db));
  const messageService: MessageService = new MessageServiceImpl(new MessageRepositoryImpl(db));

  io.use(function (socket: any, next: any) {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, Constants.TOKEN_SECRET, function (err: any, decoded: any) {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  }).on('connection', async (socket: any) => {
    const userId = String(socket.decoded.userId);
    users.set(userId, socket.id);
    const notSent = await messageService.getNotSentMessages(userId);
    if (notSent) {
      notSent.map((message) => {
        io.to(socket.id).emit('chat', { message: message.content });
      });
    }
    await messageService.updateNotSentMessages(userId);
    socket.on('chat', async (data: any) => {
      const follow = await followService.getValidateFollowing(userId, data.userId);
      if (follow) {
        messageService.createMessage(userId, data.userId, data.message);
        if (users.get(data.userId)) {
          messageService.updateNotSentMessages(data.userId);
          io.to(users.get(data.userId)).emit('chat', { message: data.message });
        } else {
          io.to(socket.id).emit('chat', { message: 'Offline User' });
        }
      } else {
        io.to(socket.id).emit('chat', { message: "They don't follow each other" });
      }
    });
    socket.on('disconnect', () => {
      users.delete(userId);
    });
  });
};
