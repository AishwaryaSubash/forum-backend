import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { FullTextDto } from './dto/full-text.dto';

@Injectable()
export class FulltextService {
  constructor(private readonly neo4jService: Neo4jService) {}
  async fullTextSearch(fullTextDto: FullTextDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `CALL db.index.fulltext.queryNodes("fullTextSearch", $text) YIELD node, score
    WITH properties(node) as n,labels(node) as label,score as score
    RETURN {label:label[0],username:n.name,userdesc:n.desc,technology:n.technology,question:n.question,questiondesc:n.description,score:score}`;

    const result = await session.run(query, {
      text: fullTextDto.text,
    });
    const res = result.records.map((item) => {
      return item.map((i) => {
        return i;
      })[0];
    });
    return res;
  }
}
