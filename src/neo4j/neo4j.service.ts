import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j from 'neo4j-driver';

@Injectable()
export class Neo4jService {
  constructor(private readonly config: ConfigService) {}
  driver = neo4j.driver(
    this.config.get('NEO4J_URI'),
    neo4j.auth.basic(
      this.config.get('NEO4J_USERNAME'),
      this.config.get('NEO4J_PASSWORD'),
    ),
  );
}
