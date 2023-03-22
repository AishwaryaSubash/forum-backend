import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import * as argon2 from 'argon2';
import { Neo4jError } from 'neo4j-driver';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, CreateUserInterface } from './dto/create-user.dto';
import { LoginUserDto, LoginUserInterface } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `CREATE (u:User {name:$name})
                       SET u.password=$password, u.email=$email, 
                       u.profileImg=$profileImg, u.createdAt=$createdAt, 
                       u.desc=$desc, u.technology=$technology
                       RETURN u`;
    const hash = await argon2.hash(createUserDto.password);
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run<CreateUserInterface>(query, {
          name: createUserDto.name,
          password: hash,
          email: createUserDto.email,
          profileImg: createUserDto.profileImg,
          desc: createUserDto.desc,
          technology: createUserDto.technology,
          createdAt: Date.now(),
        });
        const records = result.records.map((record) => {
          const name = record.get('u');
          return name.properties;
        });
        return this.signToken(records[0].name, records[0].email);
      } catch (e) {
        if (e instanceof Neo4jError) {
          if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
            throw new HttpException(
              `Username ${createUserDto.name} already exists`,
              HttpStatus.CONFLICT,
            );
          } else {
            throw new HttpException(e.message, HttpStatus.FORBIDDEN);
          }
        } else {
          throw e;
        }
      }
    });
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$name}) RETURN  u`;
    return await session.executeRead(async (tx) => {
      try {
        const result = await tx.run<LoginUserInterface>(query, {
          name: loginUserDto.name,
        });
        const records = result.records.map((record) => {
          const value = record.get('u').properties;
          return {
            name: value.name,
            password: value.password,
            email: value.email,
          };
        })[0];
        // let verified: boolean = false;
        if (!(await argon2.verify(records.password, loginUserDto.password))) {
          throw new ForbiddenException('Incorrect Password');
        }
        delete records.password;

        return this.signToken(records.name, records.email);
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else if (e instanceof ForbiddenException) {
          throw e;
        } else {
          throw new HttpException("User doesn't exist", HttpStatus.FORBIDDEN);
        }
      }
    });
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { email, sub: userId };
    const secret = this.config.get('SALT');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
    return { access_token: token };
  }
}
