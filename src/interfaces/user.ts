import { Document, Model } from 'mongoose'

interface Token {
  token: string
}

export interface UserDocument extends Document {
  name: string
  lastName: string
  userName: string
  email: string
  password: string
  tokens?: Token[]
}

export interface UserInterface extends UserDocument {
  generateAuthToken: () => string
}

export interface UserModel extends Model<UserInterface> {
  findByCredentials: (email: string, password: string) => UserInterface
}

export interface BaseUser {
  _id?: string
  name: string
  userName?: string
  lastName: string
  password?: string
  email: string
}

export interface UserAndToken {
  loggedUser: UserDocument
  token?: string
}

export interface LoggedUser extends BaseUser {
  token: string
}
