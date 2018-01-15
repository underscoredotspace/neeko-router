# Neeko Router

[![Build Status](https://img.shields.io/travis/underscoredotspace/neeko-router.svg?style=flat-square)](https://travis-ci.org/underscoredotspace/neeko-router) [![Coverage Status](https://img.shields.io/coveralls/github/underscoredotspace/neeko-router.svg?style=flat-square)](https://coveralls.io/github/underscoredotspace/neeko-router?branch=master) [![npm Version](https://img.shields.io/npm/v/neeko-router.svg?style=flat-square)](https://www.npmjs.com/package/neeko-router)

A wee client side router. Yes, routers have been done before, but... I was bored. 

In the browser, the router acts in a similar way to the AngularJS 1.x router in that you navigate to `/#/[routename]`. A route called `/page/:page` will let you go to `/#/page/5` and get an object `{page:5}` in the callback. 


## How to use

I think that the syntax is a little more pleasant than Angular's, but I make no claims about digest cycles. The user is able to click the back and forward buttons in the browser, even following a error redirection. 

```javascript
import NeekoRouter from 'neeko-router'
const router = new NeekoRouter()
```

`.on()` function will match regular text routes:

```javascript
// Matches `/#/home`
router.on('/home', () => {
  alert ('Home sweet home. Or something.')
})
```

and it will match param routes like this:

```javascript
// Matches `/#/shape/5/true` and passes an object like {points:5, trails:true} to the callback
router.on('/shape/:points/:trails', ({ points, trails }) => {
  // do something clever
})
```

After all of your initial routes have been created with `.on()` you should ask the router to make sure we're not at some other invalid route from an external link with `router.default()`: 

```javscript
router.default('/')
```

This is doing a straight redirect to that route, so it's up to you to ensure it's valid. 

Optionally, NeekoRouter can take a parameter to specify the route to go to when an invalid route is requested. The default is `/404`. 

```javascript
// Make `#/notfound` the error route
const router = new NeekoRouter('/notfound')

// Matches `/notfound`
router.on('/notfound', () => {
  alert ('This is not here')
})
```

As this is set up as an es6 module, you will need to build with something. I use Parcel since it's simple, but WebPack is more commonly used. 

Alternatively, you can import via rawgit:

```javascript
import NeekoRouter from 'https://cdn.rawgit.com/underscoredotspace/neeko-router/v1.2.1/src/router.js'
// yes that really works
const router = new NeekoRouter()
```


See Neeko Router in action at [router.messy.cloud](https://router.messy.cloud) (hosted by Netlify). This is a live version of the `/demo` folder. 


## Contributions

Fill your boots. I have no idea what my plan is for this just now, so if you have ideas please submit an [issue](https://github.com/underscoredotspace/neeko-router/issues). I will accept pull requests, ideally with test coverage for any new/changed code, but I'm happy to help with this during review. 

## Future

Version 2.0 is probably not far away, as i'd like to have an object passed to the `new NeekoRouter()` class rather than just a string to allow a few more options. I expect that the return value from the `router.on()` callback would more idiomatic like `(err, res)` rather than just the params object. 


## Licence

Most of my work is licenced under Creative Commons Attribution 4.0 International ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)), this is no exception. 


## What's a Neeko? 

My cat is called Neeko. 😸