import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './projects.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('projects') private readonly projectModel: Model<Project>,
  ) {}

  async getProjects() {
    const projects = await this.projectModel.find().exec();
    return projects.map((project) => ({
      id: project.id,
      title: project.title,
      image: project.image,
      location: project.location,
    }));
  }
}
