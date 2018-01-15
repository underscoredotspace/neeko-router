import NeekoRouter from './router'

describe('Initialisation', () => {
  test('No errorRoute parameter', () => {
    expect.assertions(1)
    const router = new NeekoRouter()
    window.location.hash = '#/404'
    router.hashChange()
    expect(router.errorRoute).toBe('/404')
  })

  test('Including errorRoute parameter', () => {
    expect.assertions(1)
    const router = new NeekoRouter('/home')

    expect(router.errorRoute).toBe('/home')
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
    expect(router.routes['/page/([^\/$]*)']).toMatchObject(expObject)
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

  test('Go to route with missing / after #', () => {
    expect.assertions(1)

    router.on('/test', () => {
      expect(window.location.hash).toBe('#/test')
    })
    window.location.hash = '#test'
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

  test('Go to route with params with trailing slash', () => {
    expect.assertions(2)
    
    router.on('/page/:page', ({page}) => {
      expect(window.location.hash).toBe('#/page/5')
      expect(page).toBe('5')
    })

    window.location.hash = '#/page/5/'
    router.hashChange()
  })


  test('Go to unset route with custom fail route', () => {
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

describe('default', () => {
  test('Go to some bad route to trigger default()', () => {
    expect.assertions(1)
    window.location.hash = '#/somebadroute'
    let router = new NeekoRouter()
    router.fakeGo = jest.fn()
    router.hashChange = jest.fn()

    router.on('/', params => {
      expect(params).toMatchObject({})
    })

    router.default('/')

    expect(router.fakeGo).toHaveBeenCalledWith('/')    
  })

  test('Go to a good route to not trigger default()', () => {
    expect.assertions(2)
    window.location.hash = '#/test'
    let router = new NeekoRouter()
    router.fakeGo = jest.fn()
    router.hashChange = jest.fn()

    router.on('/test', params => {
      expect(params).toMatchObject({})
    })

    router.default('/')

    expect(router.fakeGo).not.toHaveBeenCalled()    
  })

})

describe('normaliseHash', () => {
  let router
  beforeEach(() => {
    router = new NeekoRouter()
    router.fakeGo = jest.fn()
  })

  test('Already normal request', () => {
    expect.assertions(2)
    window.location.hash = '#/home'
    const change = router.normaliseHash()
    expect(router.fakeGo).not.toHaveBeenCalled()
    expect(change).toBe('/home')
  })

  test('Multiple slashes to be treated as one', () => {
    expect.assertions(2)
    window.location.hash = '#////page//5///'
    const change = router.normaliseHash()
    expect(router.fakeGo).toHaveBeenCalledWith('/page/5')
    expect(change).toBe('/page/5')
  })

  test('Missing slash after hash', () => {
    expect.assertions(2)
    window.location.hash = '#home'
    const change = router.normaliseHash()
    expect(router.fakeGo).toHaveBeenCalledWith('/home')
    expect(change).toBe('/home')
  })

  test('Superfulous trailing slash', () => {
    expect.assertions(2)
    window.location.hash = '#/home/'
    const change = router.normaliseHash()
    expect(router.fakeGo).toHaveBeenCalledWith('/home')
    expect(change).toBe('/home')
  })

  test('Superfulous trailing slash and missing after hash slash', () => {
    expect.assertions(2)
    window.location.hash = '#/truck/'
    const change = router.normaliseHash()
    expect(router.fakeGo).toHaveBeenCalledWith('/truck')
    expect(change).toBe('/truck')
  })

  test('No hash', () => {
    expect.assertions(2)
    window.location.hash = ''
    const change = router.normaliseHash()
    expect(router.fakeGo).toHaveBeenCalledWith('/')
    expect(change).toBe('/')
  })
})

describe('validMatcher', () => {
  let router
  beforeEach(() => {
    router = new NeekoRouter()
  })

  test('Vaid matcher, no params', () => {
    expect.assertions(2)
    const matcher = router.validMatcher('/home')
    expect(matcher.matcher).toBe('/home')
    expect(matcher.params).toHaveLength(0)
  })

  test('Vaid matcher, params', () => {
    expect.assertions(3)
    const matcher = router.validMatcher('/page/:page')
    expect(matcher.matcher).toBe('/page/([^\/$]*)')
    expect(matcher.params).toHaveLength(1)
    expect(matcher.params).toMatchObject(['page'])
  })

  test('Vaid matcher, two params', () => {
    expect.assertions(3)
    const matcher = router.validMatcher('/page/:page/section/:section')
    expect(matcher.matcher).toBe('/page/([^\/$]*)/section/([^\/$]*)')
    expect(matcher.params).toHaveLength(2)
    expect(matcher.params).toMatchObject(['page', 'section'])
  })
})


describe('checkRoute', () => {
  let router
  beforeEach(() => {
    router = new NeekoRouter()
  })
  test('given text only route should match current route', () => {
    expect.assertions(2)
    const currentRoute = '/', route = '/', cb = jest.fn()
    router.routes[route] = {cb, params:[]}
    const match = router.checkRoute(route, currentRoute)

    expect(match).toBeTruthy()
    expect(cb).toHaveBeenCalled()
  })

  test('given text only route should not match current route', () => {
    expect.assertions(2)
    const currentRoute = '/home', route = '/', cb = jest.fn()
    router.routes[route] = {cb, params:[]}
    const match = router.checkRoute(route, currentRoute)

    expect(match).toBeFalsy()
    expect(cb).not.toHaveBeenCalled()
  })

  test('given params route should match current route', () => {
    expect.assertions(2)
    const currentRoute = '/page/5', route = '/page/(.*)', cb = jest.fn()
    router.routes[route] = {cb, params:['page']}
    const match = router.checkRoute(route, currentRoute)

    expect(match).toBeTruthy()
    expect(cb).toHaveBeenCalledWith({"page": "5"})
  })

  test('given params route should not match current route', () => {
    expect.assertions(2)
    const currentRoute = '/page/bugger/indeed', route = '/page/([^\/]*)', cb = jest.fn()
    router.routes[route] = {cb, params:['page']}
    const match = router.checkRoute(route, currentRoute)

    expect(match).toBeFalsy()
    expect(cb).not.toHaveBeenCalledWith()
  })
})