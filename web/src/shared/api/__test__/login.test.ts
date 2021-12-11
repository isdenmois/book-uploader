import { localStorage } from 'shared/test-utils/local-storage'
import * as tor from '../tor-request'
import { sendLogin, setCookie, ZLIB_COOKIE } from '../login'

describe('login API', () => {
  describe('sendLogin', () => {
    it('should get cookie from the request', async () => {
      jest
        .spyOn(tor, 'request')
        .mockResolvedValue(
          '<script language="javascript">parent.location="http://zalupa.onion/?key=123&userid=963"</script>',
        )

      expect(await sendLogin('test@fb.ru', '777')).toBe('key=123; userid=963')
    })

    it('should throw an error when cookie is no available', () => {
      jest.spyOn(tor, 'request').mockResolvedValue('<script>parent.alert("Incorrect email or password")</script>')

      expect(sendLogin('hp@rolin.com', '888')).rejects.toBe("Can't login")
    })
  })

  test('setCookie', () => {
    setCookie('hellohowyoudoin')
    expect(localStorage.setItem).toHaveBeenCalledWith(ZLIB_COOKIE, 'hellohowyoudoin')

    setCookie('')
    expect(localStorage.removeItem).toHaveBeenCalledWith(ZLIB_COOKIE)
  })
})
