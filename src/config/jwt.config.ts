import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.getOrThrow<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN') as `${number}${'s' | 'm' | 'h' | 'd'}`,
  },
});
