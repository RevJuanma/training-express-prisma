import { MessageDTO } from '../dto';
import { MessageRepository } from '../repository/message.repository';
import { MessageService } from './message.service';

export class MessageServiceImpl implements MessageService {
  constructor(private readonly repository: MessageRepository) {}

  createMessage(userId: string, receptorId: string, content: string): Promise<MessageDTO> {
    return this.repository.create(userId, receptorId, content);
  }

  getMessages(userId: string): Promise<MessageDTO[]> {
    return this.repository.getMessagesByUserId(userId);
  }
  getNotSentMessages(userId: string): Promise<MessageDTO[]> {
    return this.repository.getNotSent(userId);
  }

  updateNotSentMessages(userId: string): Promise<void> {
    return this.repository.patchReceiveMessage(userId);
  }
}
