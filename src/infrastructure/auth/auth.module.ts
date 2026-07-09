import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TokenHasherService } from './token-hasher.service';
import { TOKEN_HASHER } from '../../application/auth/interfaces/token-hasher.interface';
import { BcryptService } from './bcrypt.service';
import { JwtTokenService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';
import { CookieService } from './cookie.service';
import { GoogleAuthService } from './google-auth.service';
import { GOOGLE_AUTH_SERVICE } from '../../application/auth/interfaces/google-auth.interface';
@Module({
  imports: [
    ConfigModule,
  
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN') as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      }),
    }),
  ],

  providers: [
    {
      provide: 'PASSWORD_HASHER',
      useClass: BcryptService,
    },
    {
      provide: 'TOKEN_PROVIDER',
      useClass: JwtTokenService,
    },
    {
      provide: TOKEN_HASHER,
      useClass: TokenHasherService,
    },
    {
      provide: GOOGLE_AUTH_SERVICE,
      useClass: GoogleAuthService,
    },
  
    JwtStrategy,
  
    CookieService,
  ],

  exports: [
    'PASSWORD_HASHER',
    'TOKEN_PROVIDER',
    TOKEN_HASHER,
    GOOGLE_AUTH_SERVICE,
  
    JwtModule,
  
    CookieService,
  ],
})
export class AuthInfrastructureModule {}