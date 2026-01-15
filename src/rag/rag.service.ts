import { OpenAI } from 'openai';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RagDocumentsService } from '../rag-documents/rag-documents.service';

@Injectable()
export class RAGService {
  private client: OpenAI;

  constructor(
    @Inject(forwardRef(() => RagDocumentsService))
    private readonly documents: RagDocumentsService,
    private readonly config: ConfigService,
  ) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }

  async embed(text: string): Promise<number[]> {
    const res = await this.client.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
    });
    return res.data[0].embedding;
  }

  async getContext(query: string): Promise<string> {
    const results = await this.documents.hybridSearch(query);
    const effectiveResults = results.filter((result) => result.score > 0.30);
    if (effectiveResults.length === 0) return '';
    console.log({ effectiveResults });
    return results.map((r) => r.content).join('\n---\n');
  }
}
