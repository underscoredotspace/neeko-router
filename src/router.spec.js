import NeekoRouter from './router'

describe('Initialisation', () => {
  test('No defaultRoute parameter', () => {
    expect.assertions(1)
    const router = new NeekoRouter()

    expect(router.defaultRoute).toBe('/404')
  })

  test('Including defaultRoute parameter', () => {
    expect.assertions(1)
    const router = new NeekoRouter('/home')

    expect(router.defaultRoute).toBe('/home')
  })
})

describe('Adding routes', () => {
  test('No parameters route', () => {
    expect.assertions(1)
    const router = new NeekoRouter()
    const dummyObject = {cb:jest.fn(), params:[]}
    router.on('/home', dummyObject.cb)
    expect(router.routes['/home']).toMatchObject(dummyObject)
  })

  test('A route with parameters', () => {
    expect.assertions(1)
    const router = new NeekoRouter()
    const dummyObject = {cb:jest.fn(), params:['page']}
    router.on('/page/:page', dummyObject.cb)
    expect(router.routes['/page/(.*)']).toMatchObject(dummyObject)
  })

  test('A route with no callback', () => {
    expect.assertions(2)
    const router = new NeekoRouter()
    expect(() => router.on('/oops')).toThrow('callback function required')
    expect(router.routes.length).toBe(0)
  })

  test('A route with no leading slash', () => {
    expect.assertions(1)
    const router = new NeekoRouter()
    expect(() => router.on('forgottheslash', jest.fn())).toThrow('Matcher forgottheslash is invalid')
  })

  test('A route with no leading slash and a sneaky trailing slash', () => {
    const router = new NeekoRouter()
    expect.assertions(1)
    expect(() => router.on('forgottheslash/', jest.fn())).toThrow('Matcher forgottheslash/ is invalid')
  })

  test('A route with a bad name', () => {
    const router = new NeekoRouter()
    expect.assertions(1)
    expect(() => router.on('/:toomany:colons', jest.fn())).toThrow('Matcher /:toomany:colons is invalid')
  })
})