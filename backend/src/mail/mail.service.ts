import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user, pass },
      });
      this.logger.log(`SMTP Transporter initialized for: ${user}`);
    } else {
      this.logger.warn(
        'SMTP_USER atau SMTP_PASS belum dikonfigurasi di .env. Mengaktifkan mode fallback Terminal Console.',
      );
    }
  }

  /**
   * Mengirim email pemulihan kata sandi pengguna
   */
  async sendPasswordResetEmail(to: string, resetUrl: string, userName?: string): Promise<boolean> {
    const greetingName = userName ? userName.split(' ')[0] : 'Pengguna';
    const fromAddress =
      process.env.SMTP_FROM ||
      `"Perpustakaan ILKOM UNDANA" <${process.env.SMTP_USER || 'noreply@ilkom.undana.ac.id'}>`;

    // Cari path asset logo ILKOM
    const candidatePaths = [
      path.resolve(process.cwd(), 'assets/Logo_Ilkom.png'),
      path.resolve(process.cwd(), '../frontend/public/assets/Logo_Ilkom.png'),
      path.resolve(__dirname, '../../assets/Logo_Ilkom.png'),
    ];

    let logoPath = '';
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        logoPath = p;
        break;
      }
    }

    const attachments: any[] = [];
    let logoHtml = '';

    if (logoPath) {
      attachments.push({
        filename: 'Logo_Ilkom.png',
        path: logoPath,
        cid: 'logo_ilkom',
      });
      logoHtml = `
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 14px auto;">
          <tr>
            <td align="center" style="padding: 10px; background-color: #FFFBEB; border: 2px solid #0F172A; border-radius: 12px; box-shadow: 3px 3px 0px #0F172A;">
              <img src="cid:logo_ilkom" alt="Logo ILKOM" width="48" height="48" style="display: block; width: 48px; height: 48px; object-fit: contain;" />
            </td>
          </tr>
        </table>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Kata Sandi</title>
        </head>
        <body style="margin: 0; padding: 24px; background-color: #0F172A; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border: 3px solid #1E3A8A; border-radius: 12px; box-shadow: 6px 6px 0px #1E3A8A; overflow: hidden;">
            <!-- HEADER -->
            <tr>
              <td style="padding: 28px 24px 22px 24px; background-color: #1E3A8A; text-align: center; border-bottom: 3px solid #0F172A;">
                ${logoHtml}
                <h1 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
                  Perpustakaan Ilmu Komputer
                </h1>
                <p style="margin: 4px 0 0 0; color: #93C5FD; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                  Universitas Nusa Cendana
                </p>
              </td>
            </tr>

            <!-- BODY CONTENT -->
            <tr>
              <td style="padding: 32px 28px; background-color: #ffffff;">
                <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 18px; font-weight: 800;">
                  Halo, ${greetingName}!
                </h2>
                <p style="margin: 0 0 20px 0; color: #334155; font-size: 14px; line-height: 1.6; font-weight: 500;">
                  Kami menerima permintaan untuk mengatur ulang kata sandi akun Perpustakaan ILKOM Anda. Klik tombol di bawah ini untuk membuat kata sandi baru:
                </p>

                <!-- BUTTON CTA -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 28px auto;">
                  <tr>
                    <td align="center" style="border-radius: 8px; background-color: #EA580C; border: 2px solid #1E3A8A; box-shadow: 3px 3px 0px #1E3A8A;">
                      <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 900; color: #ffffff; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">
                        Atur Ulang Kata Sandi
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 20px 0 8px 0; color: #64748B; font-size: 12px; line-height: 1.5;">
                  Atau salin tautan berikut ke browser Anda:
                </p>
                <div style="padding: 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; word-break: break-all; font-size: 11px; color: #1E3A8A; font-family: monospace;">
                  ${resetUrl}
                </div>

                <div style="margin-top: 24px; padding: 12px; background-color: #FEF3C7; border: 2px solid #F59E0B; border-radius: 8px;">
                  <p style="margin: 0; color: #92400E; font-size: 11px; font-weight: 700; line-height: 1.4;">
                    ⚠️ Tautan ini hanya berlaku selama 1 jam. Jika Anda tidak merasa meminta reset kata sandi, abaikan email ini.
                  </p>
                </div>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding: 16px; background-color: #F1F5F9; border-top: 2px solid #E2E8F0; text-align: center;">
                <p style="margin: 0; color: #64748B; font-size: 10px; font-weight: 700; text-transform: uppercase;">
                  Dikelola oleh HMP Ilmu Komputer Kabinet Arthasena
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // 1. Upaya kirim via SMTP
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: fromAddress,
          to,
          subject: 'Permintaan Reset Kata Sandi - Perpustakaan ILKOM',
          html: htmlContent,
          attachments,
        });
        this.logger.log(`Email reset password berhasil dikirim ke: ${to}`);
        return true;
      } catch (err: any) {
        this.logger.error(`Gagal mengirim email via SMTP: ${err.message}`, err.stack);
      }
    }

    // 2. Fallback Mode: Tampilkan di terminal console
    this.logger.warn(
      `\n==================== [DEV MODE: RESET PASSWORD LINK] ====================\n` +
      `Email Target : ${to}\n` +
      `Nama Akun    : ${greetingName}\n` +
      `Tautan Reset : ${resetUrl}\n` +
      `=========================================================================\n`,
    );

    return true;
  }
}
