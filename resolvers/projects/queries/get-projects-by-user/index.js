import Project from 'models/projects';
import User from 'models/users/user';

export const getProjectsByUser = Project => async (_, __, { user }) => {
  if (!user) {
    return [];
  }
  console.log(user.id)
  const QueryResults = await Project.getByUser(user.id);

  //Add the full User to each result
  const userAddedResults =  await QueryResults.map(project => {
      return {...project, user:User.getUserById(project.user_id)}
  });

  //return query results
  return userAddedResults


};

export default getProjectsByUser(Project);
