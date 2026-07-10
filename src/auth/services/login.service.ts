import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { IUserRepository } from '../interfaces/user-repository.interface';
import { USER_REPOSITORY } from '../constants/injection-tokens';

import { LoginRequestDto } from '../dto/login.dto';
import type { IPasswordHasher } from '../interfaces/password-hasher.interface';
import { GenerateLoginResponseService } from './generate-login-response.service';

@Injectable()
export class LoginService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    @Inject('PASSWORD_HASHER')
    private readonly passwordHasher: IPasswordHasher,

    private readonly generateLoginResponseService: GenerateLoginResponseService,
  ) {}

  async login(dto: LoginRequestDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'This account uses Google Sign-In. Please continue with Google.',
      );
    }

    const isMatch = await this.passwordHasher.compare(
      dto.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }

    return this.generateLoginResponseService.generate(user);
  }
}
