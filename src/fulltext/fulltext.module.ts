import { Module } from '@nestjs/common';
import { FulltextController } from './fulltext.controller';
import { FulltextService } from './fulltext.service';

@Module({
  controllers: [FulltextController],
  providers: [FulltextService]
})
export class FulltextModule {}
