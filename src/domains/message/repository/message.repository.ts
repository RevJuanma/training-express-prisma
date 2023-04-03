import { MessageDTO } from '../dto';

export interface MessageRepository {
  create(userId: string, receptorId: string, content: string): Promise<MessageDTO>;
  getMessagesByUserId(userId: string): Promise<MessageDTO[]>;
  getNotSent(userId: string): Promise<MessageDTO[]>;
  patchReceiveMessage(userId: string): Promise<void>;
}
