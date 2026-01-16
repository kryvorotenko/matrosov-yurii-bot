import { InjectRepository } from '@nestjs/typeorm';
import { RagDocumentEntity } from './entities/rag-document.entity';
import { Repository } from 'typeorm';
import { OpenAIService } from '../openai/openai.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRagDocumentDto } from './dto/create-rag-document.dto';
import { UpdateRagDocumentDto } from './dto/update-rag-document.dto';
import { RagDocumentsSimilarityResult } from './rag-documents.types';

@Injectable()
export class RagDocumentsService {
  constructor(
    @InjectRepository(RagDocumentEntity)
    private readonly repo: Repository<RagDocumentEntity>,
    @Inject(forwardRef(() => OpenAIService))
    private readonly openai: OpenAIService,
  ) {}

  async create(dto: CreateRagDocumentDto) {
    const titleEmbedding = await this.openai.embed(dto.title);
    const embedding = await this.openai.embed(`${dto.title}. ${dto.content}`);
    return this.repo.save({
      title: dto.title,
      content: dto.content,
      titleEmbedding,
      embedding,
    });
  }

  async update(id: string, dto: UpdateRagDocumentDto) {
    const doc = await this.repo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');

    const title = dto.title ?? doc.title;
    const content = dto.content ?? doc.content;

    const updatePayload: Partial<RagDocumentEntity> = { title, content };
    const isTitleChanged = dto.title && dto.title !== doc.title;
    const isContentChanged = dto.content && dto.content !== doc.content;

    if (isTitleChanged) {
      updatePayload.titleEmbedding = await this.openai.embed(title);
    }

    if (isTitleChanged && isContentChanged) {
      updatePayload.embedding = await this.openai.embed(`${title}. ${content}`);
    }

    await this.repo.update(id, updatePayload);
    return this.repo.findOne({ where: { id } });
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

  async hybridSearch(
    query: string,
    limit = 10,
  ): Promise<RagDocumentsSimilarityResult[]> {
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
