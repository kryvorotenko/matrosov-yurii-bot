import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  // pgvector
  @Column({
    type: 'vector',
    length: 3072, // text-embedding-3-large
  })
  titleEmbedding: number[];

  // pgvector
  @Column({
    type: 'vector',
    length: 3072, // text-embedding-3-large
  })
  embedding: number[];
}
