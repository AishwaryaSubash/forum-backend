import { Body, Controller, Post } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ReplyService } from './reply.service';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}
  @Post('createReply')
  async createReply(@Body() createReplyDto: CreateReplyDto) {
    return await this.replyService.createReply(createReplyDto);
  }
}
