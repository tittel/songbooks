// Filename: router.js
define(['jQuery', 'Underscore', 'Backbone', 'models/appstate', 'models/song-model', 'models/songbook-model', 'views/error-view', 'views/home-view', 'views/search-result-view', 'views/song-view', 'views/song-edit-view', 'views/songbook-view', 'views/toolbar-view', 'views/panel-view' ],
	function($, _, Backbone, state, SongModel, SongbookModel, ErrorMessage, homeView, searchResultView, songView, songEditView, songbookView, toolbarView, panelView) {
		var AppRouter = Backbone.Router.extend({
			initialize : function() {
			},
			routes : {
				'search*params' : 'searchAction',
				'song/:songId' : 'songAction',
				'songbook/:songbookId' : 'songbookAction',
				'' : 'homeAction',
				'*actions' : 'defaultAction'
			},
			searchAction : function(params) {
				var queryString = {};
				// set params as properties of queryString to be able to access and filter them by name
				params.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function($0, $1, $2, $3) { queryString[$1] = decodeURIComponent($3); });
				state.set("query", queryString.q || "", {silent: true});
				state.set("songbookId", queryString.songbookId || "", {silent: true});
				searchResultView.render();
			},
			songAction : function(songId) {
				if ("new" == songId) {
					songView.model = new SongModel();
					songEditView.render();
				}
				else {
					songView.model.set("id", songId).fetch({
						success : function() {
							songView.render();
						},
						error : function(model, response) {
							new ErrorMessage({ message : "<strong>Error loading song</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
							Backbone.history.navigate("", true);
						}
					});
				}
			},
			songbookAction : function(songbookId) {
				if ("new" == songbookId) {
					songbookView.model = new SongbookModel();
					songbookView.render();
				}
				else {
					songbookView.model.set("id", songbookId).fetch({
						success : function() {
							songbookView.render();
						},
						error : function(model, response) {
							new ErrorMessage({ message : "<strong>Error loading songbook</strong><br><i>" + response.status + " (" + response.statusText + ")</i><br>" + response.responseText });
							Backbone.history.navigate("", true);
						}
					});
				}
			},
			homeAction : function() {
				homeView.render();
			},
			defaultAction : function(actions) {
				// we have no matching route, lets redirect to home page
				new ErrorMessage({ message : "<strong>Unknown page:</strong> " + actions });
				Backbone.history.navigate("", true);
			},
			captureLinks : function() {
				if (Backbone.history && Backbone.history._hasPushState) {
					// Use delegation to avoid initial DOM selection and allow all matching elements to bubble
					$(document).delegate("a:not(.internal)", "click", function(evt) {
						var href = $(this).attr("href") || "";
						var protocol = this.protocol + "//";

						// Ensure the protocol is not part of URL, meaning its relative.
						if (href.slice(protocol.length) !== protocol) {
							evt.preventDefault();
							Backbone.history.navigate(href, true);
						}
					});
				}
			}			
		});
	
		var initialize = function() {
			var r = new AppRouter;
			Backbone.emulateJSON = false;
			Backbone.emulateHTTP = false;
			Backbone.history = Backbone.history || new Backbone.History({});
			Backbone.history.start({pushState:true, root:contextPath});
			r.captureLinks();
		};
		return {
			initialize : initialize
		};
	}
);
