import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Neo4jError } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { AllProbInCategDto } from './dto/category.dto';
import {
  CreateProblemDto,
  CreateProblemInterface,
} from './dto/create-prob.dto';
import { DeleteProblemDto } from './dto/delete-prob.dto';
import { UpdateImageDto, UpdateImageInterface } from './dto/update-image.dto';
import {
  UpvoteProblemDto,
  UpvoteProblemInterface,
} from './dto/upvote-prob.dto';
import { UserProblemDto } from './dto/user-prob.dto';

@Injectable()
export class ProblemService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async createProblem(createProblemDto: CreateProblemDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$username})
                   MATCH (p:Problem {question:$question})
                   RETURN p`;
    return await session.executeRead(async (tx) => {
      try {
        const result = await tx.run<CreateProblemInterface>(query, {
          username: createProblemDto.username,
          question: createProblemDto.question,
        });

        const records = result.records.map((record) => {
          const problem = record.get('p');
          return problem.properties;
        });
        if (records.length == 0) {
          return this.createNewProblem(createProblemDto);
        } else {
          return { message: 'Question Not Posted', verified: false };
        }
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw new HttpException(e, HttpStatus.NOT_FOUND);
        }
      }
    });
  }

  async createNewProblem(createProblemDto: CreateProblemDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$username})
                   CREATE (p:Problem {question:$question})
                   MERGE (u)-[:ASK]->(p)
                   ON CREATE SET p.description=$description, p.createdAt=$createdAt,
                   p.problemImg=$problemImg, p.upvote=$upvote
                   RETURN p`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run<CreateProblemInterface>(query, {
          username: createProblemDto.username,
          question: createProblemDto.question,
          description: createProblemDto.description,
          problemImg: createProblemDto.problemImg,
          upvote: 0,
          createdAt: Date.now(),
        });
        const records = result.records.map((record) => {
          const problem = record.get('p');
          return problem.properties;
        });
        return { data: records, verified: true };
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw new HttpException(e, HttpStatus.NOT_FOUND);
        }
      }
    });
  }

  async fetchAllProblems() {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (p:Problem)<-[:ASK]-(u:User)
                   WITH properties(p) as p ,properties(u) as u
                   RETURN {problem:p,username:u.name,userProfileImg:u.profileImg}`;
    return await session.executeRead(async (tx) => {
      try {
        const result = await tx.run(query);
        const records = result.records.map((record) => {
          return record.map((i) => {
            return i;
          });
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

  async fetchUserProblems(userProblemDto: UserProblemDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$username})-[:ASK]->(p:Problem) RETURN p`;
    return await session.executeRead(async (tx) => {
      try {
        const result = await tx.run(query, {
          username: userProblemDto.username,
        });
        const records = result.records.map((record) => {
          const problem = record.get('q');
          return problem.properties;
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

  async upvoteProblem(upvoteProblemDto: UpvoteProblemDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query1 = `MATCH (p:Problem {question:$question}) RETURN p`;
    const query2 = `MATCH (p:Problem {question:$question}) SET p.upvote=$upvote RETURN p`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query1, {
          question: upvoteProblemDto.question,
        });
        var upvote = result.records.map((record) => {
          const problem = record.get('p');
          return problem.properties;
        });
        var upvoteCount = upvote[0].upvote + 1;
        const result2 = await tx.run(query2, {
          question: upvoteProblemDto.question,
          upvote: upvoteCount,
        });
        var record = result2.records.map((record) => {
          const problem = record.get('p');
          return problem.properties;
        });
        return record;
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw new HttpException(e, HttpStatus.NOT_FOUND);
        }
      }
    });
  }

  // ! Changes reqd
  async updateImage(updateImageDto: UpdateImageDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (p:Problem {question:$question}) SET p.problemImg=$problemImg RETURN p`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run<UpdateImageInterface>(query, {
          question: updateImageDto.question,
          problemImg: updateImageDto.problemImg,
        });
        const records = result.records.map((record) => {
          const problem = record.get('p');
          return {
            question: problem.properties.question,
            problemImg: problem.properties.problemImg,
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

  // ! Changes reqd
  async deleteProblem(deleteProblemDto: DeleteProblemDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (p:Problem {question: $question})-[:HAS]->(r:Reply)
                   DETACH DELETE p, r`;
    return await session.executeWrite(async (tx) => {
      try {
        const result = await tx.run(query, {
          question: deleteProblemDto.question,
        });
        var record = result.records.map((record) => {
          const problem = record.get('p');
          return problem.properties;
        });
        return record;
      } catch (e) {
        if (e instanceof Neo4jError) {
          throw new HttpException(e.message, HttpStatus.FORBIDDEN);
        } else {
          throw e;
        }
      }
    });
  }

  async fetchAllProbInCateg(allProbInCategDto: AllProbInCategDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User)-[:ASK {categName:$categName}]->(p:Problem)
                   OPTIONAL MATCH p2 = (p)-[:HAS]->(r:Reply)
                   OPTIONAL MATCH p3 = (r)<-[:TO]-(re:Reply)
                   RETURN [u,p2,p3] as res`;
    return await session.executeRead(async (tx) => {
      try {
        const result = await tx.run(query, {
          categName: allProbInCategDto.categName,
        });
        let record = result.records.map((record) => {
          const problem = record.get('res');
          const answers = problem.map((answer) => {
            return answer;
          });
          console.log(answers);
          // console.log(problem, reply, replyTo);
          // replyTo = replyTo == null ? { properties: {} } : replyTo;
          // const problem = record.get('p');
          return answers;
        });
        return record;
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
