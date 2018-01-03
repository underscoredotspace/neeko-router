# Neeko Router

A wee client side router. Yes, routers have been done before, but... I was bored. 

In the browser, the router acts in a similar way to the AngularJS 1.x router in that you navigate to `/#/[routename]`. A route called  `/page/:page` will let you go to `/#/page/5` and get an object `{page:5}` in the callback. 


## How to use

I think that the syntax is a little more pleasant than Angular's, but I make no claims about digest cycles. 

```javascript
import NeekoRouter from 'neeko-router'
const router = new NeekoRouter()

// Matches '/#/shape/5/true` and passes an object like {points:5, trails:true} to the callback
router.on('/shape/:points/:trails', ({ points, trails }) => {
  // do something clever
})

// Matches the `/#/home`
router.on('/home', () => {
  alert ('Home sweet home. Or something.')
})
```

As this is set up as an es6 module, you will need to build with something. I use Parcel cos it's easy, but WebPack is probably most commonly used. 


## Contributions

Fill your boots. I have no idea what my plan is for this just now, so if you have ideas please share them. 

## Licence

Most of my work is licenced under Creative Commons Attribution 4.0 International ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)), this is no exception. 

## What's a Neeko? 

My cat is called Neeko. 😸