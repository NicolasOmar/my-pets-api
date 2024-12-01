import { Types, Schema } from 'mongoose'

export type MongooseDate = Schema.Types.Date

export type MongooseId = Types.ObjectId

export type MongooseString = string | MongooseId

export interface SecondaryData {
  id: MongooseId
  name: string
}

export interface Quantity {
  name: string
  quantity: number
}

export interface QueryDef {
  [queryKey: string]: string | number | null
}

export type TypedQuery<QueryDef, ContextDef, ResponseDef> = (
  noIdea: null,
  params: QueryDef,
  requestedData?: ContextDef
) => Promise<ResponseDef>

export type SimpleTypedQuery<ResponseDef> = () => Promise<ResponseDef>

export type TypedMutation<MutationDef, ContextDef, ResponseDef> = TypedQuery<
  MutationDef,
  ContextDef,
  ResponseDef
>

export type TypedRelationship<ContextDef, ResponseDef> = (
  request: ContextDef
) => Promise<ResponseDef>
