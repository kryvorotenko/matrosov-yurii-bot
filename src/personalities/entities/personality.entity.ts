import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RagDocumentEntity } from '../../rag-documents/entities/rag-document.entity';

@Entity('personalities')
export class Personality {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('varchar', { length: 32 })
  role: string;

  @Column('varchar', { length: 128 })
  name: string;

  @Column('text')
  information: string;

  @Column('text')
  communicationStyle: string;

  @Column('text')
  forbiddenTopics: string;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  aliases: string[];

  /* ---------- RAG ACCESS ---------- */

  @ManyToMany(() => RagDocumentEntity, (doc) => doc.allowedPersonalities)
  allowedRagDocuments: RagDocumentEntity[];

  @ManyToMany(() => RagDocumentEntity, (doc) => doc.forbiddenPersonalities)
  forbiddenRagDocuments: RagDocumentEntity[];
}
