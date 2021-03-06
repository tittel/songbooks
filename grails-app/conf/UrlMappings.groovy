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
		"/song/$id/download" {
			controller = "song"
			action = [GET:"download"]
		}
		"/songbook/$id/export" {
			controller = "songbook"
			action = [GET:"export"]
		}
		"/songbook/$id/add-all-songs" {
			controller = "songbook"
			action = [GET:"addAllSongs"]
		}
		name songbookDownload: "/songbook/$id/download" {
			controller = "songbook"
			action = [GET:"download"]
		}
		"/backup/import" {
			controller = "backup"
			action = [GET: "index", POST: "importBackup"]
		}
		"/backup/export" {
			controller = "backup"
			action = [GET: "exportBackup"]
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
