import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { MarkAnswerDto } from './dto/mark-answer.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('markAnswer')
  async markAnswer(@Body() markAnswerDto: MarkAnswerDto) {
    return await this.adminService.markAnswer(markAnswerDto);
  }
  @Post('unmarkAnswer')
  async unmarkAnswer(@Body() markAnswerDto: MarkAnswerDto) {
    return await this.adminService.unmarkAnswer(markAnswerDto);
  }
}
