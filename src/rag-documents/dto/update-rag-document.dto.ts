import { PartialType } from '@nestjs/mapped-types';
import { CreateRagDocumentDto } from './create-rag-document.dto';

export class UpdateRagDocumentDto extends PartialType(CreateRagDocumentDto) {}
