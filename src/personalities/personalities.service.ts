import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Personality } from './entities/personality.entity';
import { RagDocumentEntity } from '../rag-documents/entities/rag-document.entity';
import { CreatePersonalityDto } from './dto/create-personality.dto';
import { UpdatePersonalityDto } from './dto/update-personality.dto';

@Injectable()
export class PersonalitiesService {
  constructor(
    @InjectRepository(Personality)
    private readonly personalityRepo: Repository<Personality>,

    @InjectRepository(RagDocumentEntity)
    private readonly ragRepo: Repository<RagDocumentEntity>,
  ) {}

  async create(dto: CreatePersonalityDto): Promise<Personality> {
    const { allowedRagDocumentIds, forbiddenRagDocumentIds, ...data } = dto;

    const personality = this.personalityRepo.create(data);

    if (allowedRagDocumentIds?.length) {
      personality.allowedRagDocuments = await this.ragRepo.find({
        where: { id: In(allowedRagDocumentIds) },
      });
    }

    if (forbiddenRagDocumentIds?.length) {
      personality.forbiddenRagDocuments = await this.ragRepo.find({
        where: { id: In(forbiddenRagDocumentIds) },
      });
    }

    return this.personalityRepo.save(personality);
  }

  async findAll(): Promise<Personality[]> {
    return this.personalityRepo.find({
      relations: ['allowedRagDocuments', 'forbiddenRagDocuments'],
    });
  }

  async findOne(id: string): Promise<Personality> {
    const personality = await this.personalityRepo.findOne({
      where: { id },
      relations: ['allowedRagDocuments', 'forbiddenRagDocuments'],
    });

    if (!personality) {
      throw new NotFoundException('Personality not found');
    }

    return personality;
  }

  async update(id: string, dto: UpdatePersonalityDto): Promise<Personality> {
    const personality = await this.findOne(id);

    const { allowedRagDocumentIds, forbiddenRagDocumentIds, ...data } = dto;

    Object.assign(personality, data);

    if (allowedRagDocumentIds) {
      personality.allowedRagDocuments = allowedRagDocumentIds.length
        ? await this.ragRepo.find({
            where: { id: In(allowedRagDocumentIds) },
          })
        : [];
    }

    if (forbiddenRagDocumentIds) {
      personality.forbiddenRagDocuments = forbiddenRagDocumentIds.length
        ? await this.ragRepo.find({
            where: { id: In(forbiddenRagDocumentIds) },
          })
        : [];
    }

    return this.personalityRepo.save(personality);
  }

  async remove(id: string): Promise<void> {
    const personality = await this.findOne(id);
    await this.personalityRepo.remove(personality);
  }
}
