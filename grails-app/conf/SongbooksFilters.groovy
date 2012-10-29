import grails.converters.JSON
import grails.converters.XML
import grails.util.Environment

class SongbooksFilters {
	def USERNAME = "foo"
	def PASSWORD = "bar"

	def filters = {
		basicAuth(uri:"/**") {
			before = {
				if (Environment.currentEnvironment == Environment.PRODUCTION) {
					def authHeader = request.getHeader('Authorization')
					if (authHeader) {
						def usernamePassword = new String(authHeader.split(' ')[1].decodeBase64())
						if (usernamePassword == "$USERNAME:$PASSWORD") {
							return true
						}
					}
					response.setHeader('WWW-Authenticate', 'basic realm="songbooks"')
					response.sendError(response.SC_UNAUTHORIZED)
					return false
				}
				return true
			}
		}
/*		
		jsonFormat(uri:"/api/**") {
			after = { Map model ->
				if (!model) return false

				def accepts = request.getHeaders('accept')*.toLowerCase()

				def out = model.containsKey('out')?model.out:model

				if(accepts.any{ it.contains('json') }){
					render(text: out as JSON, contentType: 'application/json', encoding:"UTF-8")
				}
				else if(accepts.any{ it.contains('yaml') }){
					render(text: Yaml.dump(out), contentType: 'application/x-yaml;', encoding:"UTF-8")
				}
				else if(accepts.any{ it.contains('html') }){
					render(text: out, contentType: 'application/html', encoding:"UTF-8")
				}
				else if(accepts.any{ it.contains('xml') }){
					render(text: out as XML, contentType: 'application/xml', encoding:"UTF-8")
				}
				else {
					render(text: out as JSON, contentType: 'application/json', encoding:"UTF-8")
				}
				false
			}
		}
*/		
	}
}
