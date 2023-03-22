import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-prob.dto';
import { DeleteProblemDto } from './dto/delete-prob.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { UpvoteProblemDto } from './dto/upvote-prob.dto';
import { UserProblemDto } from './dto/user-prob.dto';
import { ProblemService } from './problem.service';

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @Post('createProblem')
  async createProblem(@Body() createProblemDto: CreateProblemDto) {
    return await this.problemService.createProblem(createProblemDto);
  }
  @Post('createNewProblem')
  async createNewProblem(@Body() createProblemDto: CreateProblemDto) {
    return await this.problemService.createNewProblem(createProblemDto);
  }
  @Get('fetchAllProblems')
  async fetchAllProblems() {
    return await this.problemService.fetchAllProblems();
  }
  @Post('fetchUserProblems')
  async fetchUserProblems(@Body() userProblemDto: UserProblemDto) {
    return await this.problemService.fetchUserProblems(userProblemDto);
  }
  @Post('upvoteProblem')
  async upvoteProblem(@Body() upvoteProblemDto: UpvoteProblemDto) {
    return await this.problemService.upvoteProblem(upvoteProblemDto);
  }
  @Post('updateImage')
  async updateImage(updateImageDto: UpdateImageDto) {
    return await this.problemService.updateImage(updateImageDto);
  }
  @Post('deleteProblem')
  async deleteProblem(deleteProblemDto: DeleteProblemDto) {
    return await this.problemService.deleteProblem(deleteProblemDto);
  }
}
