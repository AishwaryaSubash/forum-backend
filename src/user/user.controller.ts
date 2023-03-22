import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { GetUserDetailsDto } from './dto/get-user-details.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { updateDescriptionDto } from './dto/update-description.dto';
import { UserDetailsDto } from './dto/update-details.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('loginUser')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.loginUser(loginUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('updateDescription')
  async updateDescription(@Body() updateDescription: updateDescriptionDto) {
    return await this.userService.updateDescription(updateDescription);
  }

  @UseGuards(JwtGuard)
  @Post('updateProfilePic')
  async updateProfilePic(@Body() updateProfile: UpdateProfileDto) {
    return await this.userService.updateProfilePic(updateProfile);
  }

  @UseGuards(JwtGuard)
  @Post('updateDetails')
  async updateDetails(@Body() updateDetails: UserDetailsDto) {
    return await this.userService.updateDetails(updateDetails);
  }

  @UseGuards(JwtGuard)
  @Post('getUserDetails')
  async getUserDetails(@Body() getUserDetails: GetUserDetailsDto) {
    return await this.userService.getUserDetails(getUserDetails);
  }

  @UseGuards(JwtGuard)
  @Post('followUser')
  async followUser(@Body() followUser: FollowUserDto) {
    return await this.userService.followUser(followUser);
  }
}
