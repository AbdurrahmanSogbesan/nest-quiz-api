import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
  ) {}

  async signUp(dto: AuthDto) {
    try {
      const { password } = dto;
      const saltRounds = 10;
      // Hash password
      const hashedPw = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = new this.userModel({
        ...dto,
        password: hashedPw,
      });

      const createdUser = await user.save();

      const token = await this.signToken(createdUser.id, createdUser.email);

      return { status: HttpStatus.CREATED, data: token };
    } catch (error) {
      // Duplicate key error
      if (error.code === 11000) {
        throw new ForbiddenException('Email already exists!');
      }

      throw error;
    }
  }

  async login(dto: AuthDto) {
    try {
      // Fetch user
      const user = await this.userModel.findOne({ email: dto.email });

      if (!user) throw new UnauthorizedException('Credentials incorrect.');

      // Compare passwords
      const isMatch = await bcrypt.compare(dto.password, user.password);

      if (!isMatch) throw new UnauthorizedException('Credentials incorrect.');

      const token = await this.signToken(user.id, user.email);

      return { status: HttpStatus.OK, data: token };
    } catch (error) {
      throw error;
    }
  }

  async signToken(userId: string, email: string) {
    const payload = { sub: userId, email };

    const secret = process.env.JWT_SECRET;

    // Create jwt token
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret,
    });

    return { token };
  }
}
