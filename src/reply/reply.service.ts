import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Neo4jError } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateReplyDto, CreateReplyInterface } from './dto/create-reply.dto';

@Injectable()
export class ReplyService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createReply(createReplyDto: CreateReplyDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$username})
                   MATCH (p:Problem {question:$question})
                   CREATE (r:Reply {reply:$reply})
                   MERGE (r)-[:ANSWER]->(p)
                   MERGE (u)-[:POST]->(r)
                   RETURN p, u, r`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          username: createReplyDto.username,
          question: createReplyDto.question,
          reply: createReplyDto.reply,
        });
        const records = result.records.map((record) => {
          const user = record.get('u');
          const problem = record.get('p');
          const reply = record.get('r');
          return [
            { user: user.properties },
            { problem: problem.properties },
            { reply: reply.properties },
          ];
        });
        return records;
      } catch (e) {
        if (e instanceof Neo4jError) {
          if (e.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
            // throw new HttpException(
            //   `Username ${createUserDto.name} already exists`,
            //   HttpStatus.CONFLICT,
            // );
          } else {
            throw new HttpException(e.message, HttpStatus.FORBIDDEN);
          }
        } else {
          throw e;
        }
      }
    });
  }
}
