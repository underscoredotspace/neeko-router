import NeekoRouter from '../src/router'

const router = new NeekoRouter()

const routeData = document.getElementById('route-data')

router.on('/home', () => {
  routeData.innerText = 'We\'re at home. Choose a link above'
})

router.on('/page/:page', ({page}) => {
  routeData.innerText = `We're at page ${page}`
})

router.on('/404', () => {
  routeData.innerText = 'You are at 404 not found'
})

router.go('/home')