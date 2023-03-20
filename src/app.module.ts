import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { UserModule } from './user/user.module';
import { ProblemModule } from './problem/problem.module';
import { AuthModule } from './auth/auth.module';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [
    Neo4jModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProblemModule,
    ReplyModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
