// FUNCTIONS
import { parseError, parseErrorMsg } from '../parsers'
// MOCKS
import { handleErrorMessagesMock, handleErrorCodesMocks } from '../mocks/parsers.mocks.json'

describe('[Parsers]', () => {
  describe('[parseError]', () => {
    test('Should parse different Error messages', () => {
      const { error, entity, errorMsg } = handleErrorMessagesMock
      const testFns = [parseError(error, entity), parseError({}, entity)]
      const testRes = [errorMsg, parseErrorMsg.alreadyExists(entity)]

      testFns.forEach((test, i) => {
        const fnResult = test
        expect(fnResult).toBe(testRes[i])
      })
    })

    test('Should parse different Error messages based on different MongoDb codes', () => {
      handleErrorCodesMocks.codes.forEach((code, i) => {
        const fnResult = parseError({ code }, 'Entity')
        const expectedRes = !i ? parseErrorMsg.alreadyExists() : parseErrorMsg.noIdeaCode(code)

        expect(fnResult).toBe(expectedRes)
      })
    })
  })
})
