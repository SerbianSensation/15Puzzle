/*Stefan Gligorevic
* fifteen.js Lab9
*/
//globals for keeping track of empty square (in px)
var EMPTY_LEFT;
var EMPTY_TOP;

//loads functions and buttons for webpage
$(function() {
	arrangeTiles();
	$("#shufflebutton")[0].onclick = shuffle;
	setHover();
	pressTiles();
});

//arranges tiles in the correct spot for 
//when the page is loaded
function arrangeTiles() {
	var tiles = $("#puzzlearea div");
	//keeps track of column and row number
	var columnNum = 1;
	var rowNum = 1;
	//keep track of current left and top values
	//start left at -100 to make first tile has value of 0
	var currLeft = -100;
	var currTop = 0;

	tiles.each(function() {
		//add 100 px to left if column number is not > 4
		if(columnNum <= 4) {
			currLeft += 100;
			$(this).css("left", currLeft + "px");
			//maintain the current top value
			$(this).css("top", currTop + "px");
			//set id for puzzle piece based off row and col position
			$(this).attr("id", "row" + rowNum + "col" + columnNum);
			//set background image for tile
			$(this).css({
				backgroundImage: "url(background.jpg)",
				backgroundPosition: "-" + currLeft + "px -" + currTop + "px",
				backgroundSize: "400px 400px"
			});
			++columnNum;
		}
		//add 100px to top and set left to 0, starting new row
		else {
			++rowNum;
			currLeft = 0;
			$(this).css("left", currLeft + "px");
			currTop += 100;
			$(this).css("top", currTop + "px");
			//set id
			$(this).attr("id", "row" + rowNum + "col1");
			//set background image for tile
			//set background image for tile
			$(this).css({
				backgroundImage: "url(background.jpg)",
				backgroundPosition: "-" + currLeft + "px -" + currTop + "px",
				backgroundSize: "400px 400px"
			});
			columnNum = 2;
		}

	});
	//set position of empty square
	EMPTY_TOP = currTop + "px";
	EMPTY_LEFT = currLeft + 100 + "px";
} //end arrangeTiles function

/*shuffles the tiles */
function shuffle()
{
	//shuffle between 100-300 times
	var shuffleTimes = (parseInt(Math.random() * 3) + 1) * 100;
	//swap neighbor with missing tile
	for(var i=0; i<shuffleTimes; ++i){
		var neighbor = getRandomMissingTileNeighbor();
		swapEmpty(neighbor);
	}
}

/*swap with empty tile */
function swapEmpty(tile){
	var left = $(tile).css("left");
	var top = $(tile).css("top");
	//swap positions
	$(tile).css("left", EMPTY_LEFT);
	$(tile).css("top", EMPTY_TOP);

	//calculates row and col to update id
	var row = (parseInt(EMPTY_TOP) / 100) + 1;
	var col = (parseInt(EMPTY_LEFT) / 100) + 1;

	//update id
	$(tile).attr("id", "row" + row + "col" + col);

	EMPTY_LEFT = left;
	EMPTY_TOP = top;
}

/* checks if a tile can be moved
 * a.k.a is it next to the empty square
 */
 function canMove(tile){
 	var left = parseInt($(tile).css("left"));
	var top = parseInt($(tile).css("top"));

	var leftDiff = parseInt(EMPTY_LEFT) - left;
	var topDiff = parseInt(EMPTY_TOP) - top;

	//return true if empty square is left or right of tile
	if(leftDiff == 100 || leftDiff == -100){
		return topDiff == 0;
	}
	//return true if empty square is above or below tile
	if(topDiff == 100 || topDiff == -100){
		return leftDiff == 0;
	}
	return false;
}

/* function to swap tiles
 * only to be used in shuffle since
 * swapping two tiles is against the law of the game
 */
 function swapTiles(tile1, tile2){
 	var left1 = $(tile1).css("left");
	var top1 = $(tile1).css("top");
	var left2 = $(tile2).css("left");
	var top2 = $(tile2).css("top");
	//swap tile positions
	$(tile1).css("left", left2);
	$(tile1).css("top", top2);
	$(tile2).css("left", left1);
	$(tile2).css("top", top1);
	//swap id's
	var tile1id = $(tile1).attr("id");
	$(tile1).attr("id", $(tile2).attr("id"));
	$(tile2).attr("id", tile1id);
 }

/* sets up hover behavior for each tile */
function setHover(){
	var tiles = $("#puzzlearea div");

 	tiles.each(function(){
 		$(this).hover(function(){
 			if(canMove(this)){
				$(this).css("border", "5px solid red");
				$(this).css("color", "red");
			}
 		}, function(){
 			if(canMove(this)){
				$(this).css("border", "5px solid black");
				$(this).css("color", "black");
			}
 		});
 	});
}

 /* sets up the properties for when a tile is clicked
  */
 function pressTiles(){
 	var tiles = $("#puzzlearea div");

 	tiles.each(function(){
 		$(this).click(function(){
 			tileClick(this);
 		});
 	});
 }

 /* swaps tile with empty square if it is clicked
  * tile must be next to empty square
  * if not next to empty square, nothing happens
  * if the puzzle is solved after a move, print message
  */
 function tileClick(tile){
 	if(canMove(tile)){
 		swapEmpty(tile);
 		//check for Victory
 		if(isVictory()){
 			alert("Congratulations! You solved the puzzle!");
 		}
 	}
 }

 function getRandomMissingTileNeighbor(){
 	var emptyRow = (parseInt(EMPTY_TOP) / 100) + 1;
 	var emptyCol = (parseInt(EMPTY_LEFT) / 100) + 1;

 	//array to add neighbors to
 	var neighbors = [];
 	//check to see which neighbors exist
 	if($("#row" + emptyRow + "col" + (emptyCol + 1)).length != 0){
 		neighbors.push($("#row" + emptyRow + "col" + (emptyCol + 1)));
 	}
 	if($("#row" + emptyRow + "col" + (emptyCol - 1)).length != 0){
 		neighbors.push($("#row" + emptyRow + "col" + (emptyCol - 1)));
 	}
 	if($("#row" + (emptyRow + 1) + "col" + emptyCol).length != 0){
 		neighbors.push($("#row" + (emptyRow + 1) + "col" + emptyCol));
 	}
 	if($("#row" + (emptyRow - 1) + "col" + emptyCol).length != 0){
 		neighbors.push($("#row" + (emptyRow - 1) + "col" + emptyCol));
 	}

 	//pick random neighbor
 	var randNeigh = parseInt(Math.random() * neighbors.length);

 	return neighbors[randNeigh];
 }

/* checks to see if puzzle is solved
 * if puzzle is solved then returns true
 */
function isVictory(){
	var eLeft = parseInt(EMPTY_LEFT);
	var eTop = parseInt(EMPTY_TOP);
	//if empty square isn't in right spot then not solved
	if(eLeft != 300 && eTop != 300){
		return false;
	}
	var currSpot = 1;
	for(var row=1; row<5; ++row){
		for(var col=1; col<5; ++col){
			//get # of tile
			var tileNo = parseInt($("#row" + row + "col" + col).text());
			if(tileNo != currSpot){
				//check to see if we are viewing empty tile
				if(currSpot == 16){
					return true;
				}
				return false;
			}
			++currSpot;
		}
	}
	return true;
}


/* PROGRESS:
arrangeTiles : works
setting ids in arrange tiles: works
swapEmpty: works
swapTiles: works
old shuffle: works 
new shuffle: works
canMove: works
tileClick: works
pressTiles: works
getMissingTileNeighbor: works
isVictory: works
*/

//throw away code
/*

//old shuffle, doesn't check for solveable
//works but doesn't go by the writeup
function shuffle()
{
	var tiles = $("#puzzlearea div");

	tiles.each(function(){
		//calculate random num for rows
		var row = parseInt(Math.random() * 4) + 1;
		//calculate random num for cols
		var col = parseInt(Math.random() * 4) + 1;

		var id = "row" + row + "col" + col;
		// if the id doesn't exist, it's the empty square
		 // so call swapEmpty
		 //
		if($("#" + id).length == 0){
			swapEmpty(this);
		}
		//else swap the two tiles
		else{
			swapTiles(this, $("#" + id));
		}
	});
}

//testing swapEmpty
	swapEmpty($("#row1col1")[0]);
	swapEmpty($("#row3col3")[0]);

	//for pressTiles
	//go through each tile
 	for(var row = 1; row < 5; ++row){
 		for(var col = 1; col < 5; ++col){
 			var id = "row" + row + "col" + col;
 			//if a tile and not the empty block
 			if($("#" + id).length != 0){
 				$("#" + id).onclick = tileClick($("#" + id));
 			}
 		}
 	}

 	//works for moving tiles according to game rules
 	var tiles = $("#puzzlearea div");

 	tiles.each(function(){
 		$(this).click(function(){
 			if(canMove(this)){
 				swapEmpty(this);
 			}
 		});
 	});

 	//function checkVictory
 	var eLeft = parseInt(EMPTY_LEFT);
	var eTop = parseInt(EMPTY_TOP);
	//if empty square isn't in right spot then return
	if(eLeft != 300 && eTop != 300){
		return;
	}
	var rightSpot = 0;
	for(var row=1; row<5; ++row){
		for(var col=1; col<5; ++col){
			//get # of tile
			var tileNo = $("#row" + row + "col" + col).text();
			//if the col = tileNo, it's in right spot (for 1st row)
			if(tileNo == col)
			{
				++rightSpot;
			}
			//also if tileNo is col + multiple of 4, it is in right spot 
			//(for other rows)
			else{
				for(var mult=4; mult<13; mult+=4){
					if((col + mult) == tileNo){
						++rightSpot;
						break;
					}
				}
			}
		} //end inner for
	} //end outer for
	//if all in right spot, print victory message
	if(rightSpot == 15){
		alert("Congratulations! You solved the puzzle!");
	}
*/