var db;
var DB_NAME = 'HigscoresDB';
var DB_VERSION = 1;
var TABLE_HIGHSCORES = 'higscores';

$(document).ready(function() {
	$("#button-play").click(function() {
		window.location.href = "game.html";	
	});
	
	$("#button-highscores").click(function() {
		window.location.href = "highscores.html";	
	});
	
	$("#button-back").click(function() {
		window.location.href = "index.html";
	});
	
	$("#button-submit").click(function() {
		putObject(TABLE_HIGHSCORES, { "name": $("#player-name").val(), "score": $("#player-score").val() });
		alert($("#player-name").val() + " - " + $("#player-score").val());
		window.location.href = "highscores.html";
	});
});