import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Neo4jError } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ReactToReplyDto } from './dto/react-to-reply.dto';
import { ReplyToReplyDto } from './dto/reply-to-reply.dto';

@Injectable()
export class ReplyService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createReply(createReplyDto: CreateReplyDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (p:Problem {question:$question}) 
                   MATCH (u:User {name:$username})
                   CREATE (r:Reply {content:$content})
                   SET r.createdAt=$createdAt, r.reactions=$reactions, r.replyId=$replyId
                   MERGE (p)-[:HAS]->(r)<-[:POST]-(u)
                   RETURN p, u, r`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          username: createReplyDto.username,
          replyId: randomUUID(),
          question: createReplyDto.question,
          content: createReplyDto.content,
          reactions: '',
          createdAt: Date.now(),
        });
        const records = result.records.map((record) => {
          const user = record.get('u');
          const problem = record.get('p');
          const reply = record.get('r');
          delete user.properties.password;
          delete user.properties.createdAt;
          delete user.properties.technology;
          delete user.properties.email;
          delete user.properties.desc;
          delete problem.properties.createdAt;
          delete problem.properties.description;
          delete problem.properties.problemImg;
          delete problem.properties.upvote;
          delete reply.properties.createdAt;
          delete reply.properties.reactions;
          return {
            user: user.properties,
            problem: problem.properties,
            reply: reply.properties,
          };
        });

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

  async replyToReply(replyToReplyDto: ReplyToReplyDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (r:Reply {replyId: $existingReplyId})
                   MATCH (u:User {name:$username})
                   CREATE (nr:Reply {content:$newReply})
                   SET nr.createdAt=$createdAt, nr.replyId=$replyId,
                   nr.reactions=$reactions
                   MERGE (u)-[:POST]->(nr)-[:TO]->(r)
                   RETURN nr, r, u`;

    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          username: replyToReplyDto.username,
          existingReplyId: replyToReplyDto.existingReplyId,
          newReply: replyToReplyDto.newReply,
          reactions: '',
          replyId: randomUUID(),
          createdAt: Date.now(),
        });
        const records = result.records.map((record) => {
          const reply = record.get('r');
          const newReply = record.get('nr');
          const user = record.get('u');
          return {
            user: user.properties,
            newReply: newReply.properties,
            reply: reply.properties,
          };
        });
        return records;
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw new HttpException(e, HttpStatus.NOT_FOUND);
        }
      }
    });
  }

  // ! pending
  async reactToReply(reactToReplyDto: ReactToReplyDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (r:Reply {replyId: $replyId})
                   SET r.reactions=$reactions
                   RETURN r`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          replyId: reactToReplyDto.replyId,
          reactions: reactToReplyDto.reactions,
        });
        const records = result.records.map((record) => {
          const reply = record.get('r');
          return reply.properties;
        });
        return records;
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw new HttpException(e, HttpStatus.NOT_FOUND);
        }
      }
    });
  }
}
