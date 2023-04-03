import { PrismaClient } from '@prisma/client';
import { MessageDTO } from '../dto';
import { MessageRepository } from './message.repository';

export class MessageRepositoryImpl implements MessageRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(userId: string, receptorId: string, content: string): Promise<MessageDTO> {
    const message = await this.db.message.create({
      data: {
        authorId: userId,
        content: content,
        receptorId: receptorId,
        sent: false,
      },
    });
    return new MessageDTO(message);
  }

  async getMessagesByUserId(userId: string): Promise<MessageDTO[]> {
    const messages = await this.db.message.findMany({
      where: {
        authorId: userId,
      },
    });
    return messages.map((message) => new MessageDTO(message));
  }

  async getNotSent(userId: string): Promise<MessageDTO[]> {
    const messages = await this.db.message.findMany({
      where: {
        receptorId: userId,
        sent: false,
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
    });
    return messages.map((message) => new MessageDTO(message));
  }

  async patchReceiveMessage(userId: string): Promise<void> {
    await this.db.message.updateMany({
      where: {
        receptorId: userId,
        sent: false,
      },
      data: {
        sent: true,
      },
    });
  }
}
