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
   * Mengirim email pemulihan kata sandi pengguna dengan layout responsif mobile & dark mode
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
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto;">
          <tr>
            <td align="center" style="padding: 8px; background-color: #FFFFFF; border: 2px solid #0F172A; border-radius: 10px; box-shadow: 2px 2px 0px #0F172A;">
              <img src="cid:logo_ilkom" alt="Logo ILKOM" width="44" height="44" style="display: block; width: 44px; height: 44px; object-fit: contain;" />
            </td>
          </tr>
        </table>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark">
          <title>Reset Kata Sandi - Perpustakaan ILKOM</title>
          <style>
            :root {
              color-scheme: light dark;
              supported-color-schemes: light dark;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
            }
            table {
              border-spacing: 0;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
            }
            img {
              border: 0;
              line-height: 100%;
              outline: none;
              text-decoration: none;
            }
            @media only screen and (max-width: 540px) {
              .mobile-wrapper {
                padding: 12px 8px !important;
              }
              .mobile-container {
                width: 100% !important;
                max-width: 100% !important;
                border-width: 2px !important;
                box-shadow: 3px 3px 0px #1E3A8A !important;
                border-radius: 10px !important;
              }
              .mobile-header {
                padding: 20px 14px 16px 14px !important;
              }
              .mobile-title {
                font-size: 16px !important;
              }
              .mobile-body {
                padding: 22px 16px !important;
              }
              .mobile-heading {
                font-size: 17px !important;
              }
              .mobile-text {
                font-size: 13px !important;
                line-height: 1.5 !important;
              }
              .mobile-cta-table {
                width: 100% !important;
                margin: 20px 0 !important;
              }
              .mobile-cta-btn {
                display: block !important;
                width: 100% !important;
                padding: 14px 12px !important;
                font-size: 14px !important;
                box-sizing: border-box !important;
                text-align: center !important;
              }
              .mobile-url-box {
                font-size: 10px !important;
                padding: 8px !important;
              }
              .mobile-warning {
                padding: 10px 12px !important;
                font-size: 11px !important;
              }
              .mobile-footer {
                padding: 12px 14px !important;
                font-size: 9px !important;
              }
            }
            @media (prefers-color-scheme: dark) {
              .dark-body-bg {
                background-color: #090E17 !important;
              }
              .dark-card-bg {
                background-color: #111827 !important;
                color: #F3F4F6 !important;
              }
              .dark-heading {
                color: #FFFFFF !important;
              }
              .dark-subtext {
                color: #D1D5DB !important;
              }
              .dark-label {
                color: #9CA3AF !important;
              }
              .dark-url-container {
                background-color: #1F2937 !important;
                border-color: #374151 !important;
                color: #60A5FA !important;
              }
              .dark-warning-container {
                background-color: #2D1A05 !important;
                border-color: #D97706 !important;
              }
              .dark-warning-text {
                color: #FCD34D !important;
              }
              .dark-footer-bg {
                background-color: #0B1120 !important;
                border-color: #1F2937 !important;
                color: #9CA3AF !important;
              }
            }
          </style>
        </head>
        <body class="dark-body-bg" style="margin: 0; padding: 0; background-color: #0F172A; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <!-- OUTER WRAPPER TABLE -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mobile-wrapper" style="background-color: #0F172A; padding: 24px 12px;">
            <tr>
              <td align="center">
                <!-- MAIN CARD CONTAINER -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mobile-container dark-card-bg" style="max-width: 480px; background-color: #FFFFFF; border: 3px solid #1E3A8A; border-radius: 12px; box-shadow: 5px 5px 0px #1E3A8A; overflow: hidden;">
                  
                  <!-- HEADER SECTION -->
                  <tr>
                    <td align="center" class="mobile-header" style="padding: 24px 20px 18px 20px; background-color: #1E3A8A; text-align: center; border-bottom: 3px solid #0F172A;">
                      ${logoHtml}
                      <h1 class="mobile-title" style="margin: 0; color: #FFFFFF; font-size: 17px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.3;">
                        Perpustakaan Ilmu Komputer
                      </h1>
                      <p style="margin: 4px 0 0 0; color: #93C5FD; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        Universitas Nusa Cendana
                      </p>
                    </td>
                  </tr>

                  <!-- BODY CONTENT -->
                  <tr>
                    <td class="mobile-body dark-card-bg" style="padding: 28px 24px; background-color: #FFFFFF;">
                      <h2 class="mobile-heading dark-heading" style="margin: 0 0 10px 0; color: #0F172A; font-size: 18px; font-weight: 800; line-height: 1.3;">
                        Halo, ${greetingName}!
                      </h2>
                      <p class="mobile-text dark-subtext" style="margin: 0 0 18px 0; color: #334155; font-size: 14px; line-height: 1.6; font-weight: 500;">
                        Kami menerima permintaan untuk mengatur ulang kata sandi akun Perpustakaan ILKOM Anda. Klik tombol di bawah ini untuk membuat kata sandi baru:
                      </p>

                      <!-- BUTTON CTA -->
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="mobile-cta-table" style="margin: 24px auto;">
                        <tr>
                          <td align="center" style="border-radius: 8px; background-color: #EA580C; border: 2px solid #1E3A8A; box-shadow: 3px 3px 0px #1E3A8A;">
                            <a href="${resetUrl}" target="_blank" class="mobile-cta-btn" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 900; color: #FFFFFF; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px;">
                              Atur Ulang Kata Sandi
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- URL BACKUP -->
                      <p class="mobile-text dark-label" style="margin: 18px 0 6px 0; color: #64748B; font-size: 12px; line-height: 1.5; font-weight: 600;">
                        Atau salin tautan berikut ke browser Anda:
                      </p>
                      <div class="mobile-url-box dark-url-container" style="padding: 10px; background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; word-break: break-all; overflow-wrap: anywhere; font-size: 11px; color: #1E3A8A; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1.4;">
                        ${resetUrl}
                      </div>

                      <!-- SECURITY EXPIRY ALERT -->
                      <div class="mobile-warning dark-warning-container" style="margin-top: 20px; padding: 12px 14px; background-color: #FFFBEB; border: 2px solid #F59E0B; border-radius: 8px;">
                        <p class="dark-warning-text" style="margin: 0; color: #92400E; font-size: 11px; font-weight: 700; line-height: 1.5;">
                          ⚠️ Tautan ini hanya berlaku selama 1 jam. Jika Anda tidak merasa meminta reset kata sandi, silakan abaikan email ini.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td class="mobile-footer dark-footer-bg" style="padding: 14px 16px; background-color: #F1F5F9; border-top: 2px solid #E2E8F0; text-align: center;">
                      <p style="margin: 0; color: #64748B; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px;">
                        Dikelola oleh HMP Ilmu Komputer Kabinet Arthasena
                      </p>
                    </td>
                  </tr>

                </table>
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
