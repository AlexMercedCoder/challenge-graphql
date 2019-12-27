import Project from 'models/projects';
import User from 'models/users/user';

export const getProjects = Project => async (_, __, { user }) => {
  if (!user) {
    return [];
  }
  //Query the Database
  const QueryResults = await Project.query();
  //Add the full User to each result
  const userAddedResults =  await QueryResults.map(project => {
      return {...project, user:User.getUserById(project.user_id)}
  });

  //return query results
  return userAddedResults


};

export default getProjects(Project);
