export default `input LoginInputType {
    email: String!
    password: String!
    rememberMe: Boolean
  }
  type UserType {
    id: ID!
    name: String!
    email: String!
    birthDate: String!
    cpf: String!
  }
  type LoginType {
    user: UserType!
    token: String!
  }`