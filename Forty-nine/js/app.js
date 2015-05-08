var db;
var DB_NAME = 'HigscoresDB';
var DB_VERSION = 1;
var TABLE_HIGHSCORES = 'higscores';

$(document).ready(function() {
	openDB();
	var c = null;
	
	c = new Core();
	c.GenerateTiles();
	c.GenerateNextColors();
	c.DrawTiles();

	$(".board-tile").click({core: c}, c.TileClick_Handler);
});