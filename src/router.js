export default class NeekoRouter {
	constructor(defaultRoute = '/404') {
		this.routes = []
		this.hashChange = this.hashChange.bind(this)
		window.addEventListener('hashchange', this.hashChange)
		this.setDefaultRoute(defaultRoute)
		this.hashChange()
	}

	setDefaultRoute(defaultRoute) {
		this.defaultRoute = defaultRoute
		this.on(defaultRoute, () => {
			console.error('Route is invalid')
		})
	}

	on(matcher, cb) {
		if (typeof cb !== 'function') {throw(new Error(`callback function required`))}
		const validMatcher = this.validMatcher(matcher)
		if (!validMatcher) {throw(new Error(`Matcher ${matcher} is invalid`))}

		this.routes[validMatcher.matcher] = {cb, params:validMatcher.params}
		this.checkRoute(matcher)
	}

	// go to specified route
	go(route) {
		window.location.hash = `#${route}`
	}

	// checks validity of matcher
	validMatcher(matcher){
		let segments = matcher
			.replace(/\/{2,}/g, '/')					// Remove duplicated slashes
			.replace(/^\/?(.+?)\/?$/, "/$1") 	// Remove trailing slash and enforce leading
			.split('/')												// Split to array by '/'

		// Check each segment is letters, numbers or selected symbol
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
		let hash = window.location.hash
		
		if (hash.length === 0) {
			this.route = '/'
		} else {
			this.route = hash.slice(1,hash.length)
		}

		for (let route in this.routes) {
			if (this.checkRoute(route)) {return}
		}
		this.go(this.defaultRoute)
	}

	// checks to see if selected route is known
	checkRoute(route) {
		const re = new RegExp(route)
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