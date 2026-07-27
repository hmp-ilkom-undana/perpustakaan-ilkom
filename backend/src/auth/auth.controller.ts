import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { toNodeHandler } from 'better-auth/node';

@Controller('api/auth') // <-- Menangkap semua rute yang berawalan /api/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @All('*') // <-- Menangkap semua HTTP method (GET, POST, dll) dan semua sub-path
  async handler(@Req() req: Request, @Res() res: Response) {
    // toNodeHandler adalah jembatan dari Better Auth untuk framework berbasis Node/Express seperti NestJS
    const nodeHandler = toNodeHandler(this.authService.auth);
    return nodeHandler(req, res);
  }
}
