import grails.converters.JSON
import grails.converters.XML
import grails.util.Environment

class SongbooksFilters {
	def USERNAME = "foo"
	def PASSWORD = "bar"

	def filters = {

		httpsProtocol(uri:"/**") {
			before = {
				if (Environment.currentEnvironment == Environment.PRODUCTION && request.scheme == "http") {
					response.sendRedirect(request.requestURL.replaceAll("^http://", "https://"))
					return false
				}
				return true
			}
		}

		basicAuth(uri:"/**") {
			before = {
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
		}
		jsonFormat(controller: 'DISABLED', action: '*', search: true) {
			after = {
				Map model ->
				if (!model) return false

				def accepts = request.getHeaders('accept')*.toLowerCase()

				def out = model.containsKey('out')?model.out:model

				if(accepts.any{
					it.contains('json')
				}){
					render(text: out as JSON, contentType: 'application/json', encoding:"UTF-8")
				}
				else if(accepts.any{
					it.contains('yaml')
				}){
					render(text: Yaml.dump(out), contentType: 'application/x-yaml;', encoding:"UTF-8")
				}
				else if(accepts.any{
					it.contains('html')
				}){
					render(text: out as JSON, contentType: 'application/json', encoding:"UTF-8")
				}
				else if(accepts.any{
					it.contains('xml')
				}){
					render(text: out as XML, contentType: 'application/xml', encoding:"UTF-8")
				}
				else {
					render(text: out as JSON, contentType: 'application/json', encoding:"UTF-8")
				}
				false
			}
		}
	}
}
