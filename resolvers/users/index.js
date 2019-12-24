import { gql } from 'apollo-server-express';
import { adminAuth } from 'shared/authenticated';

// Mutations
import updateUser from './mutations/update-user';
import addCard from './mutations/add-card';
import addProject from './mutations/add-project';
import updateCard from './mutations/update-card';
import deleteUser from './mutations/delete-user';
import createUser from './mutations/create-user';
import updateSelf from './mutations/update-self';

// Queries
import getUsers from './queries/users';
import me from './queries/me';
import getCards from './queries/get-cards';
import getProjects from './queries/get-projects';
import getCard from './queries/get-card';
import getUser from './queries/get-user';
import getAllUsers from './queries/get-all-users';
import isDefault from './queries/is-default';
import image from './queries/image';
import test from './queries/test';

//After running the migration with Knex and watching a video or two on Graphql, I know the pattern is
// Database Schema, then migrate, then create type and resolver for GraphQL for making queries and Mutations
// So below I add a project type based on what I saw in the Knex migration file

const typeDefs = gql`
  type User {
    id: Int!
    email: String
    jwt: String
    first_name: String
    last_name: String
    role: String
    name: String
    image: String
    stripe_account_id: String
  }

  type Project {
    id: Int!
    name: String
    description: String
    user_id: Int
  }

  type UsersList {
    results: [User]
    count: Int
  }

  type Card {
    id: Int!
    name: String
    zipcode: String
    card_id: String!
    brand: String
    expiration: String
    last4: String
    isDefault: Boolean
  }

  input UpdateUserMeta {
    key: String!
    value: JSON
  }

  input UpdatePasswordInput {
    oldPassword: String!
    newPassword: String!
    newPasswordAgain: String!
  }

  enum UserRole {
    user
    admin
  }

  input UpdateUserInput {
    user_id: ID!
    email: String!
    full_nane: String!
    password: String
    role: UserRole
  }

  input CreateUserInput {
    email: String!
    full_name: String!
    role: UserRole!
    password: String
  }

  input AddCardInput {
    token: String!
    name: String!
    zipcode: String!
    isDefault: Boolean
  }

  input AddProjectInput {
    token: String!
    name: String!
    description: String!
  }

  input UpdateCardInput {
    id: Int!
    name: String
    zipcode: String
    exp_year: String
    exp_month: String
    isDefault: Boolean
  }

  input GetUsersInput {
    queryString: String
    sort: SortDirection
    page: String
    limit: String
  }

  input UpdateSelfInput {
    first_name: String
    last_name: String
    email: String
    new_password: String
    old_password: String
    image: String
  }

  input GetUserEventsInput {
    sort: SortDirection
    page: String
    limit: String
    queryString: String
  }
`;

const resolvers = {
  Query: {
    getUsers: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, getUsers),
    getUser: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, getUser),
    getAllUsers: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, getAllUsers),
    test: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, test),
    me,
    getCards,
    getProjects,
    getCard,
  },
  Mutation: {
    updateUser,
    addCard,
    addProject,
    updateCard,
    updateSelf,
    deleteUser: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, deleteUser),
    createUser: (parent, args, context, info) =>
      adminAuth(parent, args, context, info, createUser),
  },
  User: {
    image,
    name: ({ first_name, last_name, middle_name }) => {
      if (!first_name || !last_name) {
        return null;
      }

      if (middle_name) {
        return `${first_name} ${middle_name} ${last_name}`;
      }
      return `${first_name} ${last_name}`;
    },
  },
  Card: {
    expiration: async ({ exp_month, exp_year }) => {
      const month = 1 === exp_month.length ? `0${exp_month}` : exp_month;
      return `${month}/${exp_year.slice(-2)}`;
    },
    isDefault,
},
//As I understand it, the resolver essentially determines what info and how it available to GraphQL
//Currently assuming we'll filter by user during the query, so the resolver just returns an object with the
//name and description, not sure if I need to define a separate list object to hold a list of projects
//Next I'm going to info the existing mutations and queries to see how the card type was handled since
//It is also an object created and associated with a user.

Project: {
    name: ({ name, description }) => {
      return {
          name: name,
          description: description
      }
    },
  }
};

export default { resolvers, typeDefs };
