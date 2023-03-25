import { Body, Controller, Post } from '@nestjs/common';
import { FullTextDto } from './dto/full-text.dto';
import { FulltextService } from './fulltext.service';

@Controller('fulltext')
export class FulltextController {
  constructor(private readonly fullTextService: FulltextService) {}
  @Post()
  async fullText(@Body() fullTextDto: FullTextDto) {
    return await this.fullTextService.fullTextSearch(fullTextDto);
  }
}
