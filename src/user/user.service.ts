import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Neo4jError } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreateUserDto, CreateUserInterface } from './dto/create-user.dto';
import { FollowUserDto, FollowUserInterface } from './dto/follow-user.dto';
import {
  GetUserDetailsDto,
  GetUserDetailsInterface,
} from './dto/get-user-details.dto';
import { LoginUserDto, LoginUserInterface } from './dto/login-user.dto';
import {
  UpdateDescInterface,
  updateDescriptionDto,
} from './dto/update-description.dto';
import { UserDetailsDto, UserDetailsInterface } from './dto/update-details.dto';
import {
  UpdateProfileDto,
  UpdateProfileInterface,
} from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly neo4jService: Neo4jService) {}

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
        return records;
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
          };
        })[0];
        let verified: boolean = false;
        if (await argon2.verify(records.password, loginUserDto.password)) {
          verified = true;
        }
        delete records.password;
        return [{ ...records, verified }];
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw new HttpException("User doesn't exist", HttpStatus.FORBIDDEN);
        }
      }
    });
  }

  async updateDescription(updateDescription: updateDescriptionDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$name}) SET u.desc=$desc RETURN u`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run<UpdateDescInterface>(query, {
          name: updateDescription.name,
          desc: updateDescription.desc,
        });
        const records = result.records.map((record) => {
          const name = record.get('u');

          return { name: name.properties.name, desc: name.properties.desc };
        });
        return records;
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw e;
        }
      }
    });
  }

  async updateProfilePic(updateProfile: UpdateProfileDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$name}) SET u.profileImg=$profileImg RETURN u`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run<UpdateProfileInterface>(query, {
          name: updateProfile.name,
          profileImg: updateProfile.profileImg,
        });
        const records = result.records.map((record) => {
          const name = record.get('u');
          return {
            name: name.properties.name,
            profileImg: name.properties.profileImg,
          };
        });
        return records;
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw e;
        }
      }
    });
  }

  async updateDetails(updateDetails: UserDetailsDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$name}) SET u.profileImg=$profileImg,
                   u.desc=$desc,u.technology=$technology  
                   RETURN u`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run<UserDetailsInterface>(query, {
          name: updateDetails.name,
          profileImg: updateDetails.profileImg,
          desc: updateDetails.desc,
          technology: updateDetails.technology,
        });
        const records = result.records.map((record) => {
          const name = record.get('u');
          return {
            name: name.properties.name,
            profileImg: name.properties.profileImg,
            desc: name.properties.desc,
            technology: name.properties.technology,
          };
        });
        return records;
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw e;
        }
      }
    });
  }

  async getUserDetails(getUserDetails: GetUserDetailsDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name: $name}) RETURN u`;
    return await session.executeRead(async (tx) => {
      try {
        const result = await tx.run<GetUserDetailsInterface>(query, {
          name: getUserDetails.name,
        });
        const records = result.records.map((record) => {
          const name = record.get('u');
          return {
            name: name.properties.name,
            email: name.properties.email,
            profileImg: name.properties.profileImg,
            desc: name.properties.desc,
            technology: name.properties.technology,
          };
        });
        return records;
      } catch (e) {
        console.log(e);
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw e;
        }
      }
    });
  }

  async followUser(followUser: FollowUserDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name: $follower}), (p:User {name: $leader})
                   MERGE (u)-[:FOLLOW]->(p)
                   RETURN u, p`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run<FollowUserInterface>(query, {
          follower: followUser.follower,
          leader: followUser.leader,
        });
        const records = result.records.map((record) => {
          const returnValue = record.map((value) => {
            return value.properties;
          });
          if (returnValue.length == 2) {
            return {
              followed: true,
            };
          } else {
            return {
              followed: false,
            };
          }
        });
        return records.length == 0 ? { followed: false } : { followed: true };
      } catch (e) {
        console.log(e);
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw e;
        }
      }
    });
  }
}
