//After running t

import User from 'models/users/user';
import Project from 'models/projects';

export default async (
  _,
  { input: { name, description} },
  { user },
) => {
  if (!user) {
    ApolloError({
      code: 401,
    });
  }

  try {

    console.log(user)
    const newProject = await Project.create({
      name: name,
      description: description,
      user_id: user.id
    });

    return await {
        id: newProject.id,
        name: newProject.name,
        description: newProject.description,
        user_id: newProject.user_id,
        user: User.getUserById(newProject.user_id)
    }
  } catch (error) {
    ApolloError({
      code: 400,
      message: error.message,
    });
  }
};
