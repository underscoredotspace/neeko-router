import NeekoRouter from '../src/router'

const router = new NeekoRouter()

const routeData = document.getElementById('route-data')

router.on('/', () => {
  routeData.innerText = `This is home. Choose a link above`
})

router.on('/page/:page', ({page}) => {
  routeData.innerText = `This is page ${page}`
})

router.on('/404', () => {
  routeData.innerText = `This is 404 not found`
})

router.default('/')