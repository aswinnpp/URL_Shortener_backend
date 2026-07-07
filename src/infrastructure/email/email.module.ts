import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EMAIL_SERVICE } from './email.constants';
import { NodemailerService } from './nodemailer.service';

@Module({
  imports: [ConfigModule],

  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: NodemailerService,
    },
  ],

  exports: [EMAIL_SERVICE],
})
export class EmailModule {}