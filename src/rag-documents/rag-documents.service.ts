import { InjectRepository } from '@nestjs/typeorm';
import { RagDocumentEntity } from './entities/rag-document.entity';
import { Repository } from 'typeorm';
import { OpenAIService } from '../openai/openai.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

export interface SimilarityResult {
  id: string;
  title: string;
  content: string;
  score: number;
}

@Injectable()
export class RagDocumentsService {
  constructor(
    @InjectRepository(RagDocumentEntity)
    private readonly repo: Repository<RagDocumentEntity>,
    @Inject(forwardRef(() => OpenAIService))
    private readonly openai: OpenAIService,
  ) {}

  async create(title: string, content: string) {
    const embedding = await this.openai.embed(`${title}. ${content}`);

    return this.repo.save({
      title,
      content,
      embedding,
    });
  }

  async update(id: string, content: string) {
    const embedding = await this.openai.embed(content);

    await this.repo.update(id, { content, embedding });
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }

  async findAll() {
    return this.repo.find();
  }

  async recalcEmbeddings(): Promise<{ id: string; title: string }[]> {
    const docs = await this.repo.find();

    for (const doc of docs) {
      const titleEmbedding = await this.openai.embed(doc.title);
      const embedding = await this.openai.embed(`${doc.title}. ${doc.content}`);
      await this.repo.update(doc.id, { titleEmbedding, embedding });
    }

    return docs.map((d) => ({ id: d.id, title: d.title }));
  }

  async hybridSearch(query: string, limit = 10): Promise<SimilarityResult[]> {
    const queryEmbedding = await this.openai.embed(query);
    const embeddingVector = `[${queryEmbedding.join(',')}]`;

    return await this.repo.query(
      `
        SELECT
          id,
          title,
          content,

          GREATEST(
            1 - ("titleEmbedding" <=> $1::vector),
            1 - (embedding <=> $1::vector)
          ) AS semantic_score,

          GREATEST(
            1 - ("titleEmbedding" <=> $1::vector),
            1 - (embedding <=> $1::vector)
          ) AS score

        FROM "rag-documents"

        ORDER BY score DESC
          LIMIT $2
      `,
      [embeddingVector, limit],
    );
  }
}
