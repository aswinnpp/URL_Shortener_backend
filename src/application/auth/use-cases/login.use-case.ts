import {
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  
  import type { IUserRepository } from '../../../domain/repositories/user.repository';
  import { USER_REPOSITORY } from '../../../domain/repositories/token';
  
  import { LoginDto } from '../dto/login.dto';
  import type { IPasswordHasher } from '../interfaces/password-hasher.interface';
  import type { ITokenProvider } from '../interfaces/token-provider.interface';
  
  @Injectable()
  export class LoginUseCase {
    constructor(
      @Inject(USER_REPOSITORY)
      private readonly userRepository: IUserRepository,
  
      @Inject('PASSWORD_HASHER')
      private readonly passwordHasher: IPasswordHasher,
  
      @Inject('TOKEN_PROVIDER')
      private readonly tokenProvider: ITokenProvider,
    ) {}
  
    async execute(dto: LoginDto) {
      const user = await this.userRepository.findByEmail(dto.email);
  
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isMatch = await this.passwordHasher.compare(
        dto.password,
        user.password,
      );
  
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const accessToken = await this.tokenProvider.generateToken({
        sub: user.id,
        email: user.email,
      });
  
      return {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }
  }