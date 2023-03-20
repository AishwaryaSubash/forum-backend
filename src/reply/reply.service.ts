import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Neo4jError } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class ReplyService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createReply(createReplyDto: CreateReplyDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (p:Problem {question:$question}) 
                   MATCH (u:User {name:$username})
                   CREATE (r:Reply {content:$content})
                   SET r.createdAt=$createdAt, r.reactions=$reactions
                   MERGE (p)-[:HAS]->(r)
                   MERGE (u)-[:POST]->(r)
                   RETURN p.question, u.name, r.content`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          username: createReplyDto.username,
          question: createReplyDto.question,
          content: createReplyDto.content,
          reactions: createReplyDto.reactions,
          createdAt: Date.now(),
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
        delete records[0][0].user.password;
        delete records[0][0].user.createdAt;
        delete records[0][0].user.technology;
        delete records[0][0].user.email;
        delete records[0][0].problem.createdAt;
        delete records[0][0].problem.description;
        delete records[0][0].problem.description;
        delete records[0][0].problem.description;

        if (records.length == 0) {
          return { message: 'Unknown Error', verified: false };
        } else {
          return records;
        }
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
