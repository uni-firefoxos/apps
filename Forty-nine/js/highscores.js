var db;
var DB_NAME = 'HigscoresDB';
var DB_VERSION = 1;
var TABLE_HIGHSCORES = 'higscores';

$(document).ready(function() {
	openDB();
	alert("Opening DB...");
	getAllHighscores();
});