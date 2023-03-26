import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Neo4jError } from 'neo4j-driver';
import { Neo4jService } from 'src/neo4j/neo4j.service';
import { FullTextDto } from './dto/full-text.dto';

@Injectable()
export class FulltextService {
  constructor(private readonly neo4jService: Neo4jService) {}
  async fullTextSearch(fullTextDto: FullTextDto) {
    const session = this.neo4jService.driver.session({ database: 'neo4j' });
    const query = `CALL db.index.fulltext.queryNodes("fullTextSearch", $text) YIELD node, score
                   WITH properties(node) as n,labels(node) as label,score as score
                   RETURN {label:label,username:n.name,userdesc:n.desc,userImage:n.profileImg,
                   technology:n.technology,question:n.question,questiondesc:n.description,questionImage:n.problemImg, score:score}`;
    try {
      const result = await session.run(query, {
        text: fullTextDto.text,
      });
      const res = result.records.map((item) => {
        return item.map((i) => {
          return i;
        })[0];
      });
      return res;
    } catch (e) {
      if (e instanceof Neo4jError) {
        throw new HttpException(e.message, HttpStatus.FORBIDDEN);
      } else {
        throw e;
      }
    }
  }
}
