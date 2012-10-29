define([ 'Underscore', 'Backbone' ], function(_, Backbone) {
	var SongModel = Backbone.Model.extend({
		defaults : {
			"text" : "",
			"songbooks": []
		},
		initialize : function() {
		},
		url: function() {
			return "api/song/" + this.id + ".json";
		}
	});
	return SongModel;
});