import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from './projects.controller';
import { projectSchema } from './projects.model';
import { ProjectsService } from './projects.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'projects', schema: projectSchema }]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
