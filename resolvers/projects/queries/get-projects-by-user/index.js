import Project from 'models/projects';

export const getProjectsByUser = Project => async (_, __, { user }) => {
  if (!user) {
    return [];
  }
  console.log(user.id)
  return await Project.getByUser(user.id);


};

export default getProjectsByUser(Project);
