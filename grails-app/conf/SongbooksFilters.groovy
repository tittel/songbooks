import grails.converters.JSON
import grails.converters.XML

class SongbooksFilters {
	static nonAuthenticatedActions = [
		[controller:'authentication', action:'*']
	]
	def filters = {
		jsonFormat(controller: 'DISABLED', action: '*', search: true) {
			after = { Map model ->
				if (!model) return false

				def accepts = request.getHeaders('accept')*.toLowerCase()

				def out = model.containsKey('out')?model.out:model

				if(accepts.any{ it.contains('json')  }){
					render(text: out as JSON, contentType: 'application/json', encoding:"UTF-8")
				}
				else if(accepts.any{ it.contains('yaml')  }){
					render(text: Yaml.dump(out), contentType: 'application/x-yaml;', encoding:"UTF-8")
				}
				else if(accepts.any{ it.contains('html')  }){
					render(text: out as JSON, contentType: 'application/json', encoding:"UTF-8")
				}
				else if(accepts.any{ it.contains('xml')  }){
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
