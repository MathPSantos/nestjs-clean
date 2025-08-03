import { Controller, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from 'src/auth/current-user-decorator';
import type { UserPayload } from 'src/auth/jwt.startegy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub);
    return 'ok';
  }
}
