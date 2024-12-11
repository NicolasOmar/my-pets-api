import { Types, Schema, Document } from 'mongoose'

export type MongooseDate = Schema.Types.Date

export type MongooseId = Types.ObjectId

export type MongooseString = string | MongooseId

export interface EntityObject {
  name: string
}

export interface EntityDocument extends EntityObject, Document {}

export interface QuantityObject {
  name: string
  quantity: number
}

export interface QueryDef {
  [queryKey: string]: string | number | null
}

export type TypedQuery<QueryDef, ContextDef, ResponseDef> = (
  hasNoUsage: null,
  queryParams: QueryDef,
  contextData?: ContextDef
) => Promise<ResponseDef>

export type TypedSimpleQuery<ResponseDef> = () => Promise<ResponseDef>

export type TypedMutation<MutationDef, ContextDef, ResponseDef> = TypedQuery<
  MutationDef,
  ContextDef,
  ResponseDef
>

export type TypedRelationship<ContextDef, ResponseDef> = (
  request: ContextDef
) => Promise<ResponseDef>
