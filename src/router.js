export default class NeekoRouter {
	constructor(defaultRoute = '/404') {
		this.routes = []

		this.normaliseHash(window.location.hash)

		this.hashChange = this.hashChange.bind(this)
		window.addEventListener('hashchange', this.hashChange)

		this.setDefaultRoute(defaultRoute)
	}

	normaliseHash(hash) {
		const reMissingSlash = /^#([^\/].*)/
		const reTrailingSlash = /^#\/(.*)\/$/
		
		if (hash === '') {
			this.go('/')
			return true
		} else if (reMissingSlash.test(hash)) {
			this.go(`/${hash.replace(reMissingSlash, '$1')}`)
			return true
		} else if(reTrailingSlash.test(hash)) {
			this.go(`/${hash.replace(reTrailingSlash, '$1')}`)
			return true
		}

		this.route = hash.replace(/^#(.+)$/, '$1')
		return false
	}

	setDefaultRoute(defaultRoute) {
		this.defaultRoute = defaultRoute
		this.on(this.defaultRoute, () => {
			console.error('Route not found')
		})
	}

	// Add a new route
	on(matcher, cb) {
		if (typeof cb !== 'function') {throw(new Error(`callback function required`))}
		const validMatcher = this.validMatcher(matcher)
		if (!validMatcher) {throw(new Error(`Matcher ${matcher} is invalid`))}

		this.routes[validMatcher.matcher] = {cb, params:validMatcher.params}
		this.checkRoute(validMatcher.matcher)
	}

	// Go to specified route
	go(route) {
		window.location.hash = `#${route}`
	}

	// checks validity of matcher
	validMatcher(matcher){
		let segments = matcher
			.replace(/\/{2,}/g, '/')					// Remove duplicated slashes
			.replace(/^\/?(.+?)\/?$/, "/$1") 	// Remove trailing slash and enforce leading
			.split('/')												// Split to array by '/'

		// Check each segment is letters, numbers or selected symbols
		// Optionally starting with ':'
		const reMatcher = /^:?[\w\d-_\.]*$/
		let params = []
    let newSegments = []
    
		for (let segment of segments) {
			if (!reMatcher.test(segment)) {
				// ERROR: matcher segment is not in valid format
				return null
			}
			if(segment.substring(0,1) === ':') {
        const param = segment.substring(1)
        if (params.includes(param)) {
					// ERROR: matcher param is duplicate
          return null
        }
				params.push(param)
				newSegments.push('(.*)')
			} else {
        newSegments.push(segment)
      }
		}
	
		// Return cleaned up (valid) matcher
		const validMatcher = {matcher:newSegments.join('/'), params}
		return validMatcher
	}

	// called when hashchange event fires
	hashChange() {
		if (this.normaliseHash(window.location.hash)) {return}

		for (let route in this.routes) {
			if (this.checkRoute(route)) {return}
		}
		this.go(this.defaultRoute)
	}

	// checks to see if selected route is known
	checkRoute(route) {
		const re = new RegExp(`^${route}$`)
		if (re.test(this.route)) {
			let params = {}
			for (let param in this.routes[route].params) {
				params[this.routes[route].params[param]] = this.route.match(re)[Number(param)+1]
			}
			this.routes[route].cb(params)
			return true
		}
		return false
	}
}