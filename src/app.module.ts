import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';
import { OpenAIModule } from './openai/openai.module';
import { RAGModule } from './rag/rag.module';
import { RagDocumentsModule } from './rag-documents/rag-documents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres.ybuzvjoxqntkmlqrcemb:matrosov-yurii-bot@aws-1-eu-north-1.pooler.supabase.com:6543/postgres',
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TelegramModule,
    OpenAIModule,
    RAGModule,
    RagDocumentsModule,
    AuthModule,
  ],
})
export class AppModule {}
