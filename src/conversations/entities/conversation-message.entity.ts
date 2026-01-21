import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RagDocumentEntity } from '../../rag-documents/entities/rag-document.entity';
import { ConversationEntity } from './conversation.entity';

@Entity('conversation-messages')
export class ConversationMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text')
  userMessage: string;

  @Column('text')
  aiResponse: string;

  // pgvector // text-embedding-3-large
  @Column({ type: 'vector', length: 3072 })
  embedding: number[];

  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.messages,
    { onDelete: 'CASCADE' },
  )
  conversation: ConversationEntity;

  @ManyToMany(() => RagDocumentEntity, (document) => document.usedInMessages, {
    cascade: false,
  })
  @JoinTable({
    name: 'conversation_message_rag_documents',
    joinColumn: { name: 'conversationMessageId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ragDocumentId', referencedColumnName: 'id' },
  })
  usedDocuments: RagDocumentEntity[];
}
