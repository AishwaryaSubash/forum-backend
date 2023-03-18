import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Node } from 'neo4j-driver';
import { Integer } from 'neo4j-driver';
interface UserCreate extends CreateUserDto {}
type UserCreateType = Node<Integer, UserCreate>;
interface UserCreateInterface {
  p: UserCreateType;
}
@Injectable()
export class UserService {
    constructor(private readonly neo4jService: Neo4jService) {}
    async createUser(createUserDto: CreateUserDto) {
        const query = `Merge (u:USER {name:$name})
                        ON CREATE SET u.password=$password, u.email=$email 
                        RETURN u`;
        let userArr: CreateUserDto[] = [];
        try {
          await this.neo4jService.session.executeWrite((tx) => {
            tx.run<UserCreateInterface>(query, {
              name: createUserDto.name,
              password: createUserDto.password,
              email: createUserDto.email,
            }).subscribe({
              onNext(record) {
                record.map((record) => {
                  userArr.push(record.properties);
                });
              },
            });
          });
        } catch (e: any) {
          console.log(e);
        }
        return userArr;
      }
}
