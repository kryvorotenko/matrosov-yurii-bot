import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RagDocumentsService } from './rag-documents.service';
import { ApiKeyGuard } from '../auth/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('rag-documents')
export class RagDocumentsController {
  constructor(private readonly service: RagDocumentsService) {}

  @Post()
  create(@Body() body: { title: string; content: string }) {
    return this.service.create(body.title, body.content);
  }

  @Post('recalc-embeddings')
  async recalcEmbeddings() {
    return this.service.recalcEmbeddings();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { content: string }) {
    return this.service.update(id, body.content);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
