// FUNCTIONS
import { parseError, parseErrorMsg } from '../parsers'
// MOCKS
import { handleErrorMessagesMock } from '../mocks/parsers.mocks.json'

describe('[Parsers]', () => {
  describe('[parseError]', () => {
    const { error, entity, errorMsg } = handleErrorMessagesMock

    test('Should handle errorMsjs', () => {
      let fnResult = parseError(error, entity)
      expect(fnResult).toBe(errorMsg)

      fnResult = parseError({}, entity)
      expect(fnResult).toBe(parseErrorMsg.ALREADY_EXISTS(entity))
    })
  })
})
