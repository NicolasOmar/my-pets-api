// FUNCTIONS
import { encryptPass, decryptPass } from '../encrypt'
// MOCKS
import { decryptPassMocks } from '../mocks/encrypt.mocks.json'

describe('[Encrypt]', () => {
  describe('[decryptPass]', () => {
    decryptPassMocks.forEach(({ title, value }) => {
      test(title, () => {
        const mock = encryptPass(value)
        const fnResult = decryptPass(mock)
        expect(fnResult).toBe(value)
      })
    })
  })
})
