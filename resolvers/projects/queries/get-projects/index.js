import Project from 'models/projects';

export const getProjects = Project => async (_, __, { user }) => {
  if (!user) {
    return [];
  }

  return await Project.query();


};

export default getProjects(Project);
