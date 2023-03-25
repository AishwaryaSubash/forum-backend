import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Neo4jError } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { DeleteCategDto } from './dto/category.dto';
import { MarkAnswerDto } from './dto/mark-answer.dto';
import { DeleteProblemDto } from './dto/problem.dto';
import { DeleteReplyDto } from './dto/reply.dto';
import { DeleteUserDto } from './dto/user.dto';

@Injectable()
export class AdminService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async deleteUser(deleteUserDto: DeleteUserDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$username})
                   DETACH DELETE u RETURN u`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          username: deleteUserDto.username,
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

  async deleteProblem(deleteProblemDto: DeleteProblemDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (p:Problem {question: $question})
                   OPTIONAL MATCH (p)-[:HAS]->(r:Reply)
                   OPTIONAL MATCH (r)<-[:TO]-(toReply:Reply)
                   DETACH DELETE p, r, toReply RETURN p, r, toReply`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          question: deleteProblemDto.question,
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

  async deleteReply(deleteReplyDto: DeleteReplyDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (r:Reply {replyId:$replyId})
                   DETACH DELETE r RETURN r`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          replyId: deleteReplyDto.replyId,
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
  
  // ! Pending
  async deleteCategory(deleteCategDto: DeleteCategDto) {}
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
