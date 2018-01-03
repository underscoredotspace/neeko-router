export default class WeeRouter {
	constructor() {
		this.routes = []
		this.hashChange = this.hashChange.bind(this)
		window.addEventListener('hashchange', this.hashChange)
	}

	on(route, cb) {
		let params = []

		if(route.includes('/:')) {
			const parts = route.split('/')
			for(let part of parts) {
				const m = part.match(/^:(.+)$/)
				if (m) {
					params.push(m[1])
					route = route.replace(`:${m[1]}`, '([^\/]+)')
				}
			}
		}

		route = '^' + route + '\/$'

		this.routes[route] = {cb, params}
		this.hashChange()
	}

	hashChange() {
		let hash = window.location.hash
		if (hash.length === 0) {
			this.route = '/'
		} else {
			if(hash[hash.length-1] !=='/') {
				hash += '/'
			}
			this.route = hash.slice(1,hash.length)
		}
		this.checkRoutes()
	}

	checkRoutes() {
		for(let route in this.routes) {
			const re = new RegExp(route)
			if (re.test(this.route)) {
				let params = {}
				for (let param in this.routes[route].params) {
					params[this.routes[route].params[param]] = this.route.match(re)[Number(param)+1]
				}

				this.routes[route].cb(params)
			}
		}
	}
}