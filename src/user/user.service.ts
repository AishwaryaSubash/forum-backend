import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';

@Injectable()
export class UserService {
    constructor(private readonly neo4jService: Neo4jService) {}
}
