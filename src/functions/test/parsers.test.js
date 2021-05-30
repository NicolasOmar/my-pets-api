import { ERROR_MSG } from "../../constants/errors"
import { sendErrorMsg, encryptPass, decryptPass, handleErrorMessages} from "../parsers"
import { sendErrorMsgMock, decryptPassMocks, handleErrorMessagesMock } from '../mocks/parsers.mocks.json'

describe('[Parsers]', () => {
  describe('[sendErrorMsg]', () => {
    test('Should return the formatted message error as a Object property', () => {
      const fnResult = sendErrorMsg(sendErrorMsgMock)
      expect(fnResult).toEqual({ message: sendErrorMsgMock })
    })
  })

  describe('[decryptPass]', () => {
    decryptPassMocks.forEach(
      ({ title, value }) => {
        test(title, () => {
          const mock = encryptPass(value)
          const fnResult = decryptPass(mock)
          expect(fnResult).toBe(value)
        })
      }
    )
  })

  describe('[handleErrorMessages]', () => {
    const { error, entity, errorMsg } = handleErrorMessagesMock

    test('Should handle errorMsjs', () => {
      let fnResult = handleErrorMessages(error, entity)
      expect(fnResult).toBe(errorMsg)

      fnResult = handleErrorMessages({}, entity)
      expect(fnResult).toBe(ERROR_MSG.ALREADY_EXISTS(entity))
    })
  })
})