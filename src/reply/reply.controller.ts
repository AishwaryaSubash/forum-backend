import { Body, Controller, Post } from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { DeleteReplyDto } from './dto/delete-reply.dto';
import { FetchAllReplyOfProbDto } from './dto/fetch-reply.dto';
import { ReactToReplyDto } from './dto/react-to-reply.dto';
import { ReplyToReplyDto } from './dto/reply-to-reply.dto';
import { ReplyService } from './reply.service';

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}
  @Post('createReply')
  async createReply(@Body() createReplyDto: CreateReplyDto) {
    return await this.replyService.createReply(createReplyDto);
  }
  @Post('replyToReply')
  async replyToReply(@Body() replyToReplyDto: ReplyToReplyDto) {
    return await this.replyService.replyToReply(replyToReplyDto);
  }
  @Post('reactToReply')
  async reactToReply(@Body() reactToReplyDto: ReactToReplyDto) {
    return await this.replyService.reactToReply(reactToReplyDto);
  }
  @Post('fetchAllReplyOfProb')
  async fetchAllReplyOfProb(
    @Body() fetchAllReplyOfProbDto: FetchAllReplyOfProbDto,
  ) {
    return await this.replyService.fetchAllReplyOfProb(fetchAllReplyOfProbDto);
  }
  @Post('deleteReply')
  async deleteReply(@Body() deleteReplyDto: DeleteReplyDto) {
    return await this.replyService.deleteReply(deleteReplyDto);
  }
}
