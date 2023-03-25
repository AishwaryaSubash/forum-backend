import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { MarkAnswerDto } from './dto/mark-answer.dto';
import { DeleteUserDto } from './dto/user.dto';

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
  @Post('deleteUser')
  async deleteUser(@Body() deleteUserDto: DeleteUserDto) {
    return await this.adminService.deleteUser(deleteUserDto);
  }
}
