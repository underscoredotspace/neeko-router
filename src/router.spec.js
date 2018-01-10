import NeekoRouter from './router'

describe('Initialisation', () => {
  test('No defaultRoute parameter', () => {
    expect.assertions(1)
    const router = new NeekoRouter()
    window.location.hash = '#/404'
    router.hashChange()
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

/*
describe('setDefaultRoute', () => {
  
})

describe('go', () => {
  
})

describe('validMatcher', () => {
  
})

describe('checkRoute', () => {
  
})
*/