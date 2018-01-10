export default class NeekoRouter {
	constructor(defaultRoute = '/404') {
		this.routes = []

		this.normaliseHash()

		this.hashChange = this.hashChange.bind(this)
		window.addEventListener('hashchange', this.hashChange)

		this.setDefaultRoute(defaultRoute)
	}

	fakeGo(route) {
		history.replaceState(null, null, `#${route}`)
	}

	normaliseHash() {
		let hash = window.location.hash

		if (hash === '') {
			hash = '/'
			this.fakeGo(hash)
			return hash
		} 
		
		const reMissingSlash = /^([^\/].*)/
		const reTrailingSlash = /^\/(.*)\/$/

		hash = hash.replace(/^#(.+)$/, '$1')

		let changed = false
		if (reMissingSlash.test(hash)) {
			hash = `/${hash.replace(reMissingSlash, '$1')}`
			changed = true
		} 

		if (reTrailingSlash.test(hash)) {
			hash = `/${hash.replace(reTrailingSlash, '$1')}`
			changed = true
		}

		if (changed) {
			this.fakeGo(hash)
		}
		return hash
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
		this.checkRoute(validMatcher.matcher, this.normaliseHash())
	}

	// checks validity of and returns cleaned up matcher
	validMatcher(matcher){
		let segments = matcher
			.replace(/\/{2,}/g, '/')					// Remove duplicated slashes
			.replace(/^\/?(.+?)\/?$/, "/$1") 	// Remove trailing slash and enforce leading
			.replace(/\/{2,}/g, '/')					// Remove duplicated slashes created when matcher is '/'
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
		const currentRoute = this.normaliseHash()

		for (let route in this.routes) {
			if (this.checkRoute(route, currentRoute)) {return}
		}

		this.fakeGo(this.defaultRoute)
		this.hashChange()
	}

	// checks to see if selected route is known
	checkRoute(route, currentRoute) {
		const re = new RegExp(`^${route}$`)
		if (re.test(currentRoute)) {
			const matchedRoute = this.routes[route]
			let params = {}
			for (let param in matchedRoute.params) {
				params[matchedRoute.params[param]] = currentRoute.match(re)[Number(param)+1]
			}
			matchedRoute.cb(params)
			return true
		}
		return false
	}
}