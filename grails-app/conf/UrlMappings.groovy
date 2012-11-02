import org.apache.jasper.compiler.Node.ParamsAction;

class UrlMappings {
	static mappings = {
		"/api/$controller" {
			action = [GET: "list", POST: "create"]
		}
		"/api/$controller/$id" {
			action = [GET: "show", PUT: "update", DELETE: "delete", POST: "save"]
		}
		"/api/songbook/$id/song" {
			controller = "songbook"
			action = [GET:"listSong", POST:"createSong"]
		}
		"/api/songbook/$id/song/$songId" {
			controller = "songbook"
			action = [DELETE:"deleteSong"]
		}
		"/songbook/$id/export" {
			controller = "songbook"
			action = [GET:"export"]
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
		"/info"(view:"/info")
		"/song/**"(view:"/index")
		"/songbook/**"(view:"/index")
		"/search**"(view:"/index")
		"/"(view:"/index")
	}
}
