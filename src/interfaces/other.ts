import { Types } from "mongoose"

export type MongooseString = string | Types.ObjectId

export interface SecondaryData {
  id: string
  name: string
}

export interface Quantity {
  name: string
  quantity: number
}

export interface QueryParams {
  [queryKey: string]: string | number | null
}

export type TypedQuery<Params, Req, Res> = (noIdea: null, params: Params, requestedData: Req) => Promise<Res>

export type TypedMutation<Params, Req, Res> = TypedQuery<Params, Req, Res>

export type TypedRelationship<Req, Res> = (request: Req) => Promise<Res>