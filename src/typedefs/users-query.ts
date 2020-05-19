export default `
  type Query {
    users(limit: Int, offset: Int): UsersType!
  }
  `
