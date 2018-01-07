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

describe('Adding routes: `NeekoRouter.on()`', () => {
  let router

  beforeEach(() => {
    router = new NeekoRouter()
  })

  test('No parameters route', () => {
    expect.assertions(1)
    const expObject = {cb:jest.fn(), params:[]}
    router.on('/home', expObject.cb)
    expect(router.routes['/home']).toMatchObject(expObject)
  })

  test('A route with parameters', () => {
    expect.assertions(1)
    const expObject = {cb:jest.fn(), params:['page']}
    router.on('/page/:page', expObject.cb)
    expect(router.routes['/page/(.*)']).toMatchObject(expObject)
  })

  test('A route with no callback', () => {
    expect.assertions(2)
    expect(() => router.on('/oops')).toThrow('callback function required')
    expect(router.routes.length).toBe(0)
  })

  test('A route with no leading slash', () => {
    expect.assertions(1)
    const expObject = {cb:jest.fn(), params:[]}
    router.on('/forgottheslash', expObject.cb)
    expect(router.routes['/forgottheslash']).toMatchObject(expObject)
  })

  test('A route with no leading slash and a sneaky trailing slash', () => {
    expect.assertions(1)
    const expObject = {cb:jest.fn(), params:[]}
    router.on('forgottheslash/', expObject.cb)
    expect(router.routes['/forgottheslash']).toMatchObject(expObject)
  })

  test('A route with a bad name', () => {
    expect.assertions(1)
    expect(() => router.on('/:toomany:colons', jest.fn())).toThrow('Matcher /:toomany:colons is invalid')
  })

  test('A route with duplicate param', () => {
    expect.assertions(1)
    expect(() => router.on('/:page/:page', jest.fn())).toThrow('Matcher /:page/:page is invalid')
  })
})

describe('Go to route: `NeekoRouter.hashChange()`', () => {
  let router

  beforeEach(() => {
    window.location.hash = ''
    router = new NeekoRouter()
  })

  test('Go to route with no params', () => {
    expect.assertions(1)
    router.on('/test', params => {
      expect(params).toMatchObject({})
    })
    window.location.hash = '#/test'
    router.hashChange()
  })

  test('Go to route with no params', () => {
    expect.assertions(1)
    router.on('/test', params => {
      expect(params).toMatchObject({})
    })
    window.location.hash = '#/test'
    router.hashChange()
  })

  test('Go to route with params', () => {
    expect.assertions(1)
    router.on('/page/:page', params => {
      expect(params).toMatchObject({page:"5"})
    })
    window.location.hash = '#/page/5'
    router.hashChange()
  })

  test('Go to unset route', () => {
    expect.assertions(1)
    router.on('/test', params => {
      expect(params).toMatchObject({})
    })
    window.location.hash = '#/something'
    router.hashChange()
    expect(window.location.hash).toBe('#/404')
  })

  test('Go to unset route with customer fail route', () => {
    expect.assertions(1)
    router = new NeekoRouter('/fail')
    router.on('/test', params => {
      expect(params).toMatchObject({})
    })
    window.location.hash = '#/something'
    router.hashChange()
    expect(window.location.hash).toBe('#/fail')
  })
})