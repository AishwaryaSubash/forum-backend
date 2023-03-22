import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Neo4jError } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { DeleteReplyDto } from './dto/delete-reply.dto';
import { FetchAllReplyOfProbDto } from './dto/fetch-reply.dto';
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
          reactions: [],
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
                   MERGE (u)-[:COUNTER]->(nr)-[:TO]->(r)
                   RETURN nr, r, u`;

    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          username: replyToReplyDto.username,
          existingReplyId: replyToReplyDto.existingReplyId,
          newReply: replyToReplyDto.newReply,
          reactions: [],
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

  async reactToReply(reactToReplyDto: ReactToReplyDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query1 = `MATCH (r:Reply {replyId: $replyId})
                    RETURN r`;
    const query2 = `MATCH (r:Reply {replyId: $replyId})
                    SET r.reactions=$reactions
                    RETURN r`;

    return await session.executeWrite(async (tx) => {
      try {
        const result1 = await tx.run(query1, {
          replyId: reactToReplyDto.replyId,
        });
        const reactionsArray = result1.records.map((record) => {
          const reply = record.get('r');
          var reacArr = reply.properties.reactions;
          reacArr = [...reacArr, reactToReplyDto.reaction];
          return reacArr;
        });
        const result2 = await tx.run(query2, {
          replyId: reactToReplyDto.replyId,
          reactions: reactionsArray[0],
        });
        const records = result2.records.map((record) => {
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

  async fetchAllReplyOfProb(fetchAllReplyOfProbDto: FetchAllReplyOfProbDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (p:Problem {question:$question})
                   MATCH (r:Reply)<-[:TO]-(nr)
                   MATCH (u:User {name:$username})
                   WHERE (u)-[:POST]->(r)
                   DETACH DELETE r, nr`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          username: fetchAllReplyOfProbDto.question,
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

  // ! yet to check
  async deleteReply(deleteReplyDto: DeleteReplyDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (r:Reply {replyId: $replyId})<-[:TO]-(nr)
                   MATCH (u:User {name:$username})
                   WHERE (u)-[:POST]->(r)
                   DETACH DELETE r, nr`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          username: deleteReplyDto.username,
          replyId: deleteReplyDto.replyId,
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
