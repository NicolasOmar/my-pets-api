import { Document, Model } from 'mongoose'

interface Token {
  token: string
}

export interface UserObject {
  name: string
  lastName: string
  userName: string
  email: string
  password: string
  tokens: Token[]
}

export interface UserDocument extends UserObject, Document {}

export interface UserInterface extends UserDocument {
  generateAuthToken: () => string
}

export interface UserModel extends Model<UserInterface> {
  findByCredentials: (email: string, password: string) => UserInterface
}

export type LoggedUser = Omit<UserObject, 'password' | 'tokens'>

export interface UserCreateResponse extends LoggedUser {
  token: string
}

export interface UserAndToken {
  loggedUser: LoggedUser
  token?: string
}
