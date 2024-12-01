import { GraphQLResolveInfo } from 'graphql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type AmountData = {
  __typename?: 'AmountData'
  name: Scalars['String']['output']
  quantity: Scalars['Int']['output']
}

export type AuxiliaryData = {
  __typename?: 'AuxiliaryData'
  id: Scalars['ID']['output']
  name: Scalars['String']['output']
}

export type CreateEventInput = {
  associatedPets: Array<InputMaybe<Scalars['ID']['input']>>
  date: Scalars['String']['input']
  description: Scalars['String']['input']
}

export type Event = {
  __typename?: 'Event'
  associatedPets: Array<Maybe<Pet>>
  date: Scalars['String']['output']
  description: Scalars['String']['output']
  id: Scalars['ID']['output']
}

export type Mutation = {
  __typename?: 'Mutation'
  createEvent?: Maybe<Event>
  createPet?: Maybe<Pet>
  createUser?: Maybe<User>
  loginUser?: Maybe<User>
  logout: Scalars['Boolean']['output']
  updatePass?: Maybe<Scalars['Boolean']['output']>
  updatePet: Scalars['Boolean']['output']
  updateUser?: Maybe<User>
}

export type MutationCreateEventArgs = {
  eventInfo: CreateEventInput
}

export type MutationCreatePetArgs = {
  petInfo: PetInput
}

export type MutationCreateUserArgs = {
  newUser?: InputMaybe<UserInput>
}

export type MutationLoginUserArgs = {
  email: Scalars['String']['input']
  password: Scalars['String']['input']
}

export type MutationUpdatePassArgs = {
  newPass: Scalars['String']['input']
  oldPass: Scalars['String']['input']
}

export type MutationUpdatePetArgs = {
  petInfo: PetInput
}

export type MutationUpdateUserArgs = {
  lastName: Scalars['String']['input']
  name: Scalars['String']['input']
}

export type Pet = {
  __typename?: 'Pet'
  adoptionDate?: Maybe<Scalars['String']['output']>
  birthday?: Maybe<Scalars['String']['output']>
  events?: Maybe<Array<Maybe<Event>>>
  eyeColors?: Maybe<Array<Maybe<AuxiliaryData>>>
  gender: Scalars['String']['output']
  hairColors?: Maybe<Array<Maybe<AuxiliaryData>>>
  hasHeterochromia?: Maybe<Scalars['Boolean']['output']>
  height?: Maybe<Scalars['Float']['output']>
  id: Scalars['ID']['output']
  isAdopted: Scalars['Boolean']['output']
  length?: Maybe<Scalars['Float']['output']>
  name: Scalars['String']['output']
  passedAway: Scalars['Boolean']['output']
  petType: AuxiliaryData
  user?: Maybe<User>
  weight?: Maybe<Scalars['Float']['output']>
}

export type PetInput = {
  adoptionDate?: InputMaybe<Scalars['String']['input']>
  birthday?: InputMaybe<Scalars['String']['input']>
  eyeColors?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
  gender: Scalars['String']['input']
  hairColors?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
  hasHeterochromia?: InputMaybe<Scalars['Boolean']['input']>
  height?: InputMaybe<Scalars['Float']['input']>
  id?: InputMaybe<Scalars['ID']['input']>
  isAdopted: Scalars['Boolean']['input']
  length?: InputMaybe<Scalars['Float']['input']>
  name: Scalars['String']['input']
  passedAway?: InputMaybe<Scalars['Boolean']['input']>
  petType: Scalars['ID']['input']
  weight?: InputMaybe<Scalars['Float']['input']>
}

export type Query = {
  __typename?: 'Query'
  getColors: Array<Maybe<AuxiliaryData>>
  getMyPetEvents?: Maybe<Array<Maybe<Event>>>
  getMyPets: Array<Maybe<Pet>>
  getMyPetsPopulation?: Maybe<Array<Maybe<AmountData>>>
  getPet?: Maybe<Pet>
  getPetTypes: Array<Maybe<AuxiliaryData>>
  getUser: User
}

export type QueryGetMyPetEventsArgs = {
  petId: Scalars['ID']['input']
}

export type QueryGetMyPetsArgs = {
  search?: InputMaybe<Scalars['String']['input']>
}

export type QueryGetPetArgs = {
  id: Scalars['ID']['input']
}

export type User = {
  __typename?: 'User'
  email: Scalars['String']['output']
  id: Scalars['ID']['output']
  lastName: Scalars['String']['output']
  name: Scalars['String']['output']
  password?: Maybe<Scalars['String']['output']>
  pets: Array<Maybe<Pet>>
  token: Scalars['String']['output']
  userName?: Maybe<Scalars['String']['output']>
}

export type UserInput = {
  email: Scalars['String']['input']
  lastName: Scalars['String']['input']
  name: Scalars['String']['input']
  password: Scalars['String']['input']
  userName: Scalars['String']['input']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AmountData: ResolverTypeWrapper<AmountData>
  AuxiliaryData: ResolverTypeWrapper<AuxiliaryData>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>
  CreateEventInput: CreateEventInput
  Event: ResolverTypeWrapper<Event>
  Float: ResolverTypeWrapper<Scalars['Float']['output']>
  ID: ResolverTypeWrapper<Scalars['ID']['output']>
  Int: ResolverTypeWrapper<Scalars['Int']['output']>
  Mutation: ResolverTypeWrapper<{}>
  Pet: ResolverTypeWrapper<Pet>
  PetInput: PetInput
  Query: ResolverTypeWrapper<{}>
  String: ResolverTypeWrapper<Scalars['String']['output']>
  User: ResolverTypeWrapper<User>
  UserInput: UserInput
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AmountData: AmountData
  AuxiliaryData: AuxiliaryData
  Boolean: Scalars['Boolean']['output']
  CreateEventInput: CreateEventInput
  Event: Event
  Float: Scalars['Float']['output']
  ID: Scalars['ID']['output']
  Int: Scalars['Int']['output']
  Mutation: {}
  Pet: Pet
  PetInput: PetInput
  Query: {}
  String: Scalars['String']['output']
  User: User
  UserInput: UserInput
}

export type AmountDataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AmountData'] = ResolversParentTypes['AmountData']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type AuxiliaryDataResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AuxiliaryData'] = ResolversParentTypes['AuxiliaryData']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type EventResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']
> = {
  associatedPets?: Resolver<Array<Maybe<ResolversTypes['Pet']>>, ParentType, ContextType>
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  createEvent?: Resolver<
    Maybe<ResolversTypes['Event']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateEventArgs, 'eventInfo'>
  >
  createPet?: Resolver<
    Maybe<ResolversTypes['Pet']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreatePetArgs, 'petInfo'>
  >
  createUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    Partial<MutationCreateUserArgs>
  >
  loginUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginUserArgs, 'email' | 'password'>
  >
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  updatePass?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePassArgs, 'newPass' | 'oldPass'>
  >
  updatePet?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePetArgs, 'petInfo'>
  >
  updateUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'lastName' | 'name'>
  >
}

export type PetResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Pet'] = ResolversParentTypes['Pet']
> = {
  adoptionDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  birthday?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  events?: Resolver<Maybe<Array<Maybe<ResolversTypes['Event']>>>, ParentType, ContextType>
  eyeColors?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['AuxiliaryData']>>>,
    ParentType,
    ContextType
  >
  gender?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  hairColors?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['AuxiliaryData']>>>,
    ParentType,
    ContextType
  >
  hasHeterochromia?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  height?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isAdopted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  length?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  passedAway?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  petType?: Resolver<ResolversTypes['AuxiliaryData'], ParentType, ContextType>
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  weight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  getColors?: Resolver<Array<Maybe<ResolversTypes['AuxiliaryData']>>, ParentType, ContextType>
  getMyPetEvents?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Event']>>>,
    ParentType,
    ContextType,
    RequireFields<QueryGetMyPetEventsArgs, 'petId'>
  >
  getMyPets?: Resolver<
    Array<Maybe<ResolversTypes['Pet']>>,
    ParentType,
    ContextType,
    Partial<QueryGetMyPetsArgs>
  >
  getMyPetsPopulation?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['AmountData']>>>,
    ParentType,
    ContextType
  >
  getPet?: Resolver<
    Maybe<ResolversTypes['Pet']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetPetArgs, 'id'>
  >
  getPetTypes?: Resolver<Array<Maybe<ResolversTypes['AuxiliaryData']>>, ParentType, ContextType>
  getUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  pets?: Resolver<Array<Maybe<ResolversTypes['Pet']>>, ParentType, ContextType>
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  userName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  AmountData?: AmountDataResolvers<ContextType>
  AuxiliaryData?: AuxiliaryDataResolvers<ContextType>
  Event?: EventResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Pet?: PetResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  User?: UserResolvers<ContextType>
}
