import { Controller, All, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { toNodeHandler } from 'better-auth/node';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All('*')
  async handler(@Req() req: Request, @Res() res: Response) {
    const nodeHandler = toNodeHandler(this.authService.auth);
    return nodeHandler(req, res);
  }
}


