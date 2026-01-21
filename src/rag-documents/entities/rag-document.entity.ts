import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationMessageEntity } from '../../conversations/entities/conversation-message.entity';

@Entity('rag-documents')
export class RagDocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  title: string;

  @Column('text')
  content: string;

  // pgvector // text-embedding-3-large
  @Column({ type: 'vector', length: 3072 })
  titleEmbedding: number[];

  // pgvector // text-embedding-3-large
  @Column({ type: 'vector', length: 3072 })
  embedding: number[];

  @ManyToMany(() => ConversationMessageEntity, (m) => m.usedDocuments)
  usedInMessages: ConversationMessageEntity[];
}
