import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';

const pageQueryParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .min(1)
  .default(1);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const limit = 20;

    const questions = await this.prisma.question.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'asc',
      },
    });

    return { questions };
  }
}
