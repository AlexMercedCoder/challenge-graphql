import { gql } from 'apollo-server-express';
import { adminAuth } from 'shared/authenticated';

// Mutations
import addProject from './mutations/add-project';


// Queries
import getProjects from './queries/get-projects';
import getProjectsByUser from './queries/get-projects-by-user';


const typeDefs = gql`

  type Project {
    id: Int!
    name: String!
    description: String
    user_id: Int
    user: User
  }

  input AddProjectInput {
    name: String!
    description: String!
  }


`;

const resolvers = {
  Query: {
    getProjects,
    getProjectsByUser
  },
  Mutation: {
    addProject,
  },

};

export default { resolvers, typeDefs };
