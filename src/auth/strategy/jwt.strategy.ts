import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreateUserDto } from '../dto/create-user.dto';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private neo4jService: Neo4jService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SALT'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$sub}) where u.email = $email return u`;
    //   console.log(query);
    let user: CreateUserDto;
    await session
      .run(query, {
        sub: payload.sub,
        email: payload.email,
      })
      .then((result) => {
        result.records.forEach((item) => {
          user = item.get('u').properties;
        });
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        session.close();
      });
    //console.log(user);
    delete user.password;
    delete user.profileImg;
    delete user.technology;
    delete user.desc;
    return user;
  }
}
