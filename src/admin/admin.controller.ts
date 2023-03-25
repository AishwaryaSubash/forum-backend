import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { DeleteCategDto } from './dto/category.dto';
import { MarkAnswerDto } from './dto/mark-answer.dto';
import { DeleteProblemDto } from './dto/problem.dto';
import { DeleteReplyDto } from './dto/reply.dto';
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
  @Post('deleteProblem')
  async deleteProblem(@Body() deleteProblemDto: DeleteProblemDto) {
    return await this.adminService.deleteProblem(deleteProblemDto);
  }
  
  // ! Changes reqd
  @Post('deleteReply')
  async deleteReply(@Body() deleteReplyDto: DeleteReplyDto) {
    return await this.adminService.deleteReply(deleteReplyDto);
  }
  // ! Pending
  @Post('deleteCateg')
  async deleteCategory(@Body() deleteCategDto: DeleteCategDto) {
    return await this.adminService.deleteCategory(deleteCategDto);
  }
}
