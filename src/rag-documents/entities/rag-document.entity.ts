import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationMessageEntity } from '../../conversations/entities/conversation-message.entity';
import { Personality } from '../../personalities/entities/personality.entity';

@Entity('rag-documents')
@Index('idx_rag_allowed_roles', (doc: RagDocumentEntity) => [doc.allowedRoles])
@Index('idx_rag_forbidden_roles', (doc: RagDocumentEntity) => [
  doc.forbiddenRoles,
])
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

  /* ---------- ACCESS CONTROL ---------- */
  @Column({ type: 'text', array: true, nullable: true })
  allowedRoles?: string[];

  @Column({ type: 'text', array: true, nullable: true })
  forbiddenRoles?: string[];

  @ManyToMany(
    () => Personality,
    (personality) => personality.allowedRagDocuments,
  )
  @JoinTable({ name: 'rag_document_allowed_personalities' })
  allowedPersonalities: Personality[];

  @ManyToMany(
    () => Personality,
    (personality) => personality.forbiddenRagDocuments,
  )
  @JoinTable({ name: 'rag_document_forbidden_personalities' })
  forbiddenPersonalities: Personality[];
}
