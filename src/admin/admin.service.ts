import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Injectable()
export class AdminService {
  constructor(private readonly neo4jService:Neo4jService) {}

  async deleteUser(){
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `MATCH (u:User {name:$name})-[:ASK]->(q:Problem)
                   MATCH (u)-[:COUNTER]->(r:Reply)
                   MATCH (u)-[:POST]->(r)
                   DETACH DELETE u,q,r RETURN u,q,r`;
  }
}
