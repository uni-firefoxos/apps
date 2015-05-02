var db;
var DB_NAME = 'HigscoresDB';
var DB_VERSION = 1;
var TABLE_HIGHSCORES = 'higscores';

var Core = function() {
	$("#container-board").empty();

	this.colors = new Array();
	this.colors[0] = "#E6E6E6"; 																			// gray
	this.colors[1] = "#BAFF3B";																				// green
	this.colors[2] = "#FF803B";																				// orange
	this.colors[3] = "#3BBAFF";																				// blue
	this.colors[4] = "#803BFF";																				// purple

	this.selected = null;																					// Currently selected tile's id
	this.score = 0;																							// Player's score
	this.randomTilesNumber = 3;																				// Number of generated tiles next round
	this.free = [];																							// Array of free tiles
	this.nextColors = [ "#E6E6E6", "#E6E6E6", "#E6E6E6", "#E6E6E6", "#E6E6E6", "#E6E6E6" ];
	this.nextColors[0] = this.colors[Math.floor(Math.random() * 4) + 1];
	this.nextColors[1] = this.colors[Math.floor(Math.random() * 4) + 1];
	this.nextColors[2] = this.colors[Math.floor(Math.random() * 4) + 1];
	
	this.board = [];
	for (var i = 0; i < 7; i++) {
		this.board[i] = [];
		for (var j = 0; j < 7; j++) {
			this.board[i][j] = new Tile(i, j);
			this.free.push(this.board[i][j].id);
			$("#container-board").append('<div class="board-tile" id="' + this.board[i][j].row + "_" + this.board[i][j].column + '"></div>');	// Append tile
		};
	};

	this.DrawTiles = function() {
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 7; j++) {
				$(this.board[i][j].id).css("background-color", this.board[i][j].color);						// Draw tiles with their current colours
			}
		}

		$("#un_00").css("background-color", this.nextColors[0]);
		$("#un_01").css("background-color", this.nextColors[1]);
		$("#un_02").css("background-color", this.nextColors[2]);
		$("#un_10").css("background-color", this.nextColors[3]);
		$("#un_11").css("background-color", this.nextColors[4]);
		$("#un_12").css("background-color", this.nextColors[5]);
		
		if (this.free.length == 0) {
			alert("A játéknak vége!\nA pontszámod: " + this.score);
			$("#big-container").css("display", "none");
			$("#popup-score-input").css("display", "block");
			$("#player-score").val(this.score);
		}
	}

	this.GenerateNextColors = function() {
		for (var i = 0; i < this.randomTilesNumber; i++) {
			this.nextColors[i] = this.colors[Math.floor(Math.random() * 4) + 1];
		}
	}

	this.GenerateTiles = function() {
		if (this.free.length > this.randomTilesNumber) {
			for (var i = 0; i < this.randomTilesNumber; i++) {													//	randomTilesNumbernyi csempét generálok
				var tmp_id = this.free[Math.floor(Math.random() * this.free.length)];							//		
				tmp_id = tmp_id.replace('#', '');																//	tmp_id <- a szabad csempék közül az egyik id
				var res = tmp_id.split('_');																	//	szétbontom az id-t _ mentén, hogy kapjak sor-oszlopot
				this.board[res[0]][res[1]].color = this.nextColors[i];											//	átállítom a generált idjű csempe színét
				this.free.splice(this.free.indexOf("#" + tmp_id), 1);											//	törlöm a szabad csempék közül a generált csempét
			}
		} else {
			for (var i = 0; i < this.free.length; i++) {
				var tmp_id = this.free[i];
				tmp_id = tmp_id.replace('#', '');
				var res = tmp_id.split('_');
				this.board[res[0]][res[1]].color = this.nextColors[i];
				this.free.splice(this.free.indexOf("#" + tmp_id), 1);
			}
		}
	}

	this.TileClick_Handler = function(event) {
		if (event.data.core.selected == null) {																//	ha még nincs kiválasztva csempe
			var color = $(this).attr("id").split('_');														//	lekérem a kiválasztott csempe idját
			color = event.data.core.board[color[0]][color[1]].color;										//	lekérem a kiválasztott csempe színét 
			if (color != event.data.core.colors[0]) {														//	ha az adott szín nem szürke
				event.data.core.selected = $(this).attr("id");												//	akkor eltárolom az id-t
				window.navigator.vibrate(500);
			}
		} else if (event.data.core.selected != null) {														//	ha már van kiválasztott csempe
			var tmp = $(this).attr("id").split('_');														//	lekérem a választott elem idját
			tmp = event.data.core.board[tmp[0]][tmp[1]];													//	tmp-be belerakom az adott csempét
			if (tmp.id != "#" + event.data.core.selected && tmp.color == event.data.core.colors[0]) {		//	ha az adott id nem egyezik meg az előzőleg kiválasztottal és
																											//	a színe nem szürke
				var prev = event.data.core.selected.split('_');												//	szétkapom az id-t
				var prev_color = event.data.core.board[prev[0]][prev[1]].color;								//	lekérem a színét az előzőnek
				tmp = $(this).attr("id").split('_');														//	szétkapom az aktuális id-t
				
				event.data.core.board[prev[0]][prev[1]].color = event.data.core.colors[0];					//	az előző színét szürkére állítom
				event.data.core.board[tmp[0]][tmp[1]].color = prev_color;									//	az aktuális színét az előző színére
				
				event.data.core.free.splice(event.data.core.free.indexOf("#" + $(this).attr("id")), 1);		//	az aktuális idjű elemet kiszedem a szabadokból
				event.data.core.free.push("#" + event.data.core.selected);									//	az előzőleg választottat pedig hozzáadom a szabadokhoz

				// TODO: minimum 4esek keresése és eltávolítása
				//	current_color <- az aktuális szín, amiből egymás mellettieket keresünk
				//	tmp[0] <- sor  tmp[1] <- oszlop
				//	tile_buffer <- azokat a csempéket rakom el amiket törölni kéne
				//	didDeletion <- ha volt törlés, akkor az adott "körben" nincs csempe generálás
				var current_color = prev_color;
				var tile_buffer = [];
				var didDeletion = false;
				
				// sorra nézve
				for (var i = 0; i < 7; i++) {
					if (tile_buffer.length == 0 && event.data.core.board[tmp[0]][i].color == current_color) {
						tile_buffer.push(i);
					} else if (event.data.core.board[tmp[0]][i].color == current_color && event.data.core.board[tmp[0]][i - 1].color == current_color) {
						tile_buffer.push(i);
					}
				}
				
				if (tile_buffer.length >= 4) {
					didDeletion = true;
					for (var i = 0; i < tile_buffer.length; i++) {
						event.data.core.board[tmp[0]][tile_buffer[i]].color = event.data.core.colors[0];
						event.data.core.free.push("#" + tmp[0] + "_" + tile_buffer[i]);
						event.data.core.score += 10;
					}
					window.navigator.vibrate(1000);
				}
				tile_buffer.splice(0, tile_buffer.length);

				// oszlopra nézve
				for (var i = 0; i < 7; i++) {
					if (tile_buffer.length == 0 && event.data.core.board[i][tmp[1]].color == current_color) {
						tile_buffer.push(i);
					} else if (event.data.core.board[i][tmp[1]].color == current_color && event.data.core.board[i - 1][tmp[1]].color == current_color) {
						tile_buffer.push(i);
					}
				}
				
				if (tile_buffer.length >= 4) {
					didDeletion = true;
					for (var i = 0; i < tile_buffer.length; i++) {
						event.data.core.board[tile_buffer[i]][tmp[1]].color = event.data.core.colors[0];
						event.data.core.free.push("#" + tile_buffer[i] + "_" + tmp[1]);
						event.data.core.score += 10;
						window.navigator.vibrate(1000);
					}
				}
				tile_buffer.splice(0, tile_buffer.length);
				
				if (event.data.core.score > 1500) 
					event.data.core.randomTilesNumber = 6;
				else if (event.data.core.score > 1000) 
					event.data.core.randomTilesNumber = 5;
				else if (event.data.core.score > 500) 
					event.data.core.randomTilesNumber = 4;
				
				if (!didDeletion) {
					event.data.core.GenerateTiles();
					event.data.core.GenerateNextColors();
				}
				$("#score").html("Score: " + event.data.core.score);
				event.data.core.DrawTiles();
			}
			event.data.core.selected = null;
			window.navigator.vibrate(500);
		}
	}
}

var Tile = function (row, column) {
	this.row = row;
	this.column = column;
	this.color = "#E6E6E6";
	this.id = "#" + this.row + "_" + this.column;
};

function openDB() {
	var req = window.indexedDB.open(DB_NAME, DB_VERSION);
	req.onsuccess = function(event) {
		db = this.result;
	};
	
	req.onupgradeneeded = function(event) {
		try {
			var store0 = event.currentTarget.result.createObjectStore(TABLE_HIGHSCORES, { keyPath: 'id', autoIncrement: true });
			store0.createIndex('score', 'score', { unique: false });
		}
		catch (e) { console.log(e); }
	}
}

function getObjectStore(store_name, mode) {
	var tx = db.transaction(store_name, mode);
	return tx.objectStore(store_name);
}

function getAllHighscores() {
	store = getObjectStore(TABLE_HIGHSCORES, 'readonly');
	
	req = store.index('score').openCursor();
	req.onsuccess = function(event) {
		var cursor = req.result;
		if (cursor) {
			var value = cursor.value;
			$("#container-highscores").append('<h2>' + value.name + ': ' + value.score + '</h2>');
            cursor.continue();
		}
	}
}

function putObject(table_name, data) {
	storeI = getObjectStore(table_name, 'readwrite');
	request = storeI.add(data);
}