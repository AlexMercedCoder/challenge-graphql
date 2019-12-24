import Project from 'models/projects';

export const getProjects = Project => async (_, __, { user }) => {
  if (!user) {
    return [];
  }

  const Projects = await Project.get(user.id);

  if (!Projects.length) {
    return [];
  }

  return Projects.reduce((acc, Project) => {
    if (parseInt(Project.id) === user.default_Project) {
      acc.unshift(Project);
    } else {
      acc.push(Project);
    }

    return acc;
  }, []);
};

export default getProjects(Project);
