import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationMessageEntity } from './conversation-message.entity';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * External identificator (telegram user/chat id, whatsapp id, web session id, etc.)
   * For example: "telegram:123456789", "whatsapp:3223322332", "web:233232332"
   */
  @Column({ type: 'varchar', length: 128, unique: true })
  externalId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('boolean', { default: false })
  isViewedByAdmin: boolean;

  @Column({ type: 'jsonb', nullable: true })
  userMetadata: Record<string, any> | null;

  @Column('text', { nullable: true })
  summary: string | null;

  @Column({ type: 'int', default: 0 })
  messagesCount: number;

  @OneToMany(() => ConversationMessageEntity, (m) => m.conversation, {
    cascade: true,
  })
  messages: ConversationMessageEntity[];
}
