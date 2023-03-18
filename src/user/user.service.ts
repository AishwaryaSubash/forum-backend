import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Node } from 'neo4j-driver';
import { Integer } from 'neo4j-driver';
import * as argon2 from 'argon2';

interface UserCreate extends CreateUserDto {}
type UserCreateType = Node<Integer, UserCreate>;
interface UserCreateInterface {
  u: UserCreateType;
}

@Injectable()
export class UserService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createUser(createUserDto: CreateUserDto) {
    const query = `MERGE (u:User {name:$name})
                   ON CREATE SET u.password=$password, u.email=$email , 
                   u.profileImg=$profileImg, u.createdAt=TIMESTAMP(), 
                   u.desc=$desc, u.technology=$technology
                   RETURN u`;
    let userArr: any[] = [];

    const hash = await argon2.hash(createUserDto.password);

    await this.neo4jService.session.executeWrite((tx) => {
      tx.run<UserCreateInterface>(query, {
        name: createUserDto.name,
        password: hash,
        email: createUserDto.email,
        profileImg: createUserDto.profileImg,
        desc: createUserDto.desc,
        technology: createUserDto.technology,
      })
        .then((record) => {
          const records = record.records.map((record) => {
            const name = record.get('u');
            return name.properties;
          });
          userArr = records;
        })
        .catch((e) => {
          throw e;
        });
    });

    return userArr;
  }

  
}
