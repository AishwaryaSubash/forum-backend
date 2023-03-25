import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Neo4jError } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { MarkAnswerDto } from './dto/mark-answer.dto';

@Injectable()
export class AdminService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async deleteUser() {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$name})-[:ASK]->(q:Problem)
                   MATCH (u)-[:COUNTER]->(r:Reply)
                   MATCH (u)-[:POST]->(r)
                   DETACH DELETE u,q,r RETURN u,q,r`;
  }

  async markAnswer(markAnswerDto: MarkAnswerDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (p:Problem {question:$question})-[h:HAS]->(r:Reply {replyId:$replyId})
                   SET h.markAnswer=true
                   RETURN h`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          question: markAnswerDto.question,
          replyId: markAnswerDto.replyId,
        });
        return result;
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw e;
        }
      }
    });
  }

  async unmarkAnswer(markAnswerDto: MarkAnswerDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (p:Problem {question:$question})-[h:HAS]->(r:Reply {replyId:$replyId})
                   SET h.markAnswer=NULL
                   RETURN h`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          question: markAnswerDto.question,
          replyId: markAnswerDto.replyId,
        });
        return result;
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw e;
        }
      }
    });
  }
}
