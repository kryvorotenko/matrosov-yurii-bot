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
import { CreateRagDocumentDto } from './dto/create-rag-document.dto';
import { UpdateRagDocumentDto } from './dto/update-rag-document.dto';

@UseGuards(ApiKeyGuard)
@Controller('rag-documents')
export class RagDocumentsController {
  constructor(private readonly service: RagDocumentsService) {}

  @Post()
  create(@Body() dto: CreateRagDocumentDto) {
    return this.service.create(dto);
  }

  @Post('recalc-embeddings')
  recalcEmbeddings() {
    return this.service.recalcEmbeddings();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRagDocumentDto) {
    return this.service.update(id, dto);
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
