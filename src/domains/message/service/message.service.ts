import { MessageDTO } from '../dto';

export interface MessageService {
  createMessage(userId: string, receptorId: string, content: string): Promise<MessageDTO>;
  getMessages(userId: string): Promise<MessageDTO[]>;
  getNotSentMessages(userId: string): Promise<MessageDTO[]>;
  updateNotSentMessages(userId: string): Promise<void>;
}
