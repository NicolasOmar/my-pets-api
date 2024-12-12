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

export interface UserAndToken {
  loggedUser: LoggedUser
  token?: string
}

// PAYLOADS
export interface UserLoginPayload {
  payload: Pick<UserObject, 'email' | 'password'>
}

export interface UserCreatePayload {
  payload: UserObject
}

export interface UserUpdatePayload {
  payload: Pick<UserObject, 'name' | 'lastName'>
}

export interface UserPassChangePayload {
  payload: {
    oldPass: string
    newPass: string
  }
}

// RESPONSES
export interface UserCreateResponse extends LoggedUser {
  token: string
}
