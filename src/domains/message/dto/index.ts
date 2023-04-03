import { IsNotEmpty } from 'class-validator';

export class MessageDTO {
  constructor(message: MessageDTO) {
    this.id = message.id;
    this.content = message.content;
    this.authorId = message.authorId;
    this.receptorId = message.receptorId;
    this.sent = message.sent;
    this.createdAt = message.createdAt;
  }

  id: string;
  content: string;
  authorId: string;
  receptorId: string;
  sent: boolean;
  createdAt: Date;
}
