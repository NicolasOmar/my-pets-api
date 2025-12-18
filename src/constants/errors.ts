export enum SERVER_MSGS {
  IS_DUPLICATED = 'E11000 duplicate key error collection:',
  MISSING_ENCRYPTION = 'Malformed UTF-8 data',
  FAILED_VALIDATION = 'validation failed:'
}

export enum ERROR_MSGS {
  ALPHA = 'The field needs to contain letters only',
  EMAIL = 'The user needs a valid mail format (@site.com) to be created',
  UPDATES = 'Invalid update data',
  LOGIN = 'Your email and/or password is incorrect. Try again with other credentials',
  PROVIDED_PASSWORDS = 'The provided passwords are not correct. Try again with the correct ones',
  NEEDS_ENCRYPTION = 'It seems your data is not correctly encrypted. Please contact your administrator',
  AUTHENTICATE = 'Please authenticate to keep using the app',
  MISSING_USER_DATA = 'Missing user data',
  MISSING_PET_DATA = 'There is no such Pet with the name provided',
  DUPLICATED_ENTITY = 'Is duplicated',
  MISSING_EVENT_ID = 'There is no such Event ID provided',
  MISSING_EVENT_DATA = 'There is no such Event with the name provided'
}

export enum HTTP_CODES {
  UNAUTHORIZED = '401',
  NOT_FOUND = '404',
  UNPROCESSABLE_ENTITY = '422',
  INTERNAL_ERROR_SERVER = '500'
}
