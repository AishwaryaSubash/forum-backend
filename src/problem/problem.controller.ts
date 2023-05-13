import { Body, Controller, Get, Post } from '@nestjs/common';
import { AllProbInCategDto } from './dto/category.dto';
import { CreateProblemDto } from './dto/create-prob.dto';
import { DeleteProblemDto } from './dto/delete-prob.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { GetOneProblemDto, UpvoteProblemDto } from './dto/upvote-prob.dto';
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
  @Post('getUpvoteCount')
  async getUpvoteCount(@Body() getUpvoteDto: GetOneProblemDto) {
    return await this.problemService.getUpvoteCount(getUpvoteDto);
  }
  @Post('updateImage')
  async updateImage(@Body() updateImageDto: UpdateImageDto) {
    return await this.problemService.updateImage(updateImageDto);
  }
  @Post('deleteProblem')
  async deleteProblem(@Body() deleteProblemDto: DeleteProblemDto) {
    return await this.problemService.deleteProblem(deleteProblemDto);
  }

  @Post('fetchAllProbInCateg')
  async fetchAllProbInCateg(@Body() allProbInCategDto: AllProbInCategDto) {
    return await this.problemService.fetchAllProbInCateg(allProbInCategDto);
  }

  @Post('getOneProblemAndReplies')
  async getOneProblemAndReplies(@Body() getOneProblem: GetOneProblemDto) {
    return await this.problemService.getOneProblemAndReplies(getOneProblem);
  }
}
