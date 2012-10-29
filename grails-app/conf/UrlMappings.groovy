class UrlMappings {
	static mappings = {
		"/api/$controller" {
			action = [GET: "list", POST: "create"]
		}
		"/api/$controller/$id" {
			action = [GET: "show", PUT: "update", DELETE: "delete", POST: "save"]
		}
		"/import" {
			controller = "import"
			action = [GET: "index", POST: "result"]
		}
		"/export" {
			controller = "export"
			action = [GET: "index"]
		}
/*		
		"/$controller/$action?/$id?"{
            constraints {
            }
        }
*/		
		"/"(view:"/index")
		"500"(view:'/error')
	}
}
