$(function() {

	if($.fiveinarow)
		return;

	$.fn.fiveinarow = function(options) {
		'use strict';

		var isCurrentPlayerRed = true,//Flag for checking who is the current player
			isDiskFilled = true,//Flag for checking if the the disk is correctly filled or not
			isGameOver = false,//Flag to check if the game is over or not
			isEventHandled = false,//Flag to make sure that the storage event is not called more than once
			disk = {
				red: {//red circles
					name: 'red',
					fill: 'red',
					stroke: 'purple'
				},
				yellow: {//yellow circles
					name: 'yellow',
					fill: 'yellow',
					stroke: 'seagreen'
				}
			}, 
			cells = [//The 19x19 cell matrix for the canvas
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','',''],
				['','','','','','','','','','','','','','','','','','','']
			],
			canvas, context, request, winner = '',
			settings = $.extend({
			canvas: {
				id: 'fiveinarow',
				background: 'royalblue'
			},
			disk: {//disk diameter and padding between two disks
				diameter: 'default',
				padding: 8
			},
			text: {//text size and font
				size: 80,
				font: 'Arial',
				padding: 8
			},
			target: 4,
			pageBackground: 'white'
			}, options);

			canvas = document.getElementById(settings.canvas.id);
			context = canvas.getContext('2d');
			canvas.style.background = settings.canvas.background;

			if (settings.disk.diameter == 'default')
				settings.disk.diameter = (canvas.width/19) - (settings.disk.padding * 2);

			//Draw the circles on the canvas
			function drawCircle(cx, cy, fill, stroke) {
				context.beginPath();
				context.arc(cx, cy, settings.disk.diameter/2, 0, 2 * Math.PI, false);
				context.shadowColor = stroke;
				context.shadowOffsetX = 3;
				context.shadowOffsetY = 3;
				context.shadowBlur = 8;
				context.fillStyle = fill;
				context.fill();
				context.lineWidth = 2;
				context.strokeStyle = stroke;
				context.stroke();
			}

			//Fill in the details for the circle, like center-X, center-Y, color fill, and color stroke
			function drawDisk(col, row, name) {
				var cx = (canvas.width / 19) * (col + 1) - settings.disk.diameter / 2 - settings.disk.padding,
					cy = canvas.height - ((canvas.height / 19) * (row + 1) - settings.disk.diameter / 2 - settings.disk.padding);
				switch (name) {
	                case disk.red.name:
	                    drawCircle(cx, cy, disk.red.fill, disk.red.stroke);
	                    break;

	                case disk.yellow.name:
	                    drawCircle(cx, cy, disk.yellow.fill, disk.yellow.stroke);
	                    break;

	                default:
	                    drawCircle(cx, cy, settings.pageBackground, settings.pageBackground);
            	}
			}

			//Draws the disks for the entire cell matrix
			function drawDisks() {
				for (var row = 0; row < cells.length; row++) {
					for (var col=0; col < cells[row].length; col++) {
						drawDisk(col, row, cells[row][col]);
					}
				}
			}

			//Evaluate the clicked point, check if it is a legitimate point and if it is a legitimate point, set the matrix element color
			//Also set the cookie value for the multi-browser session
	        function addDisk(row, col, clickedX, clickedY, name) {
                if (cells[row][col] == '' || cells[row][col] === undefined) {
                	var cx = (canvas.width / 19) * (col + 1) - settings.disk.diameter / 2 - settings.disk.padding,
						cy = (canvas.height / 19) * (row + 1) - settings.disk.diameter / 2 - settings.disk.padding;
						if(Math.sqrt((clickedX - cx) * (clickedX - cx) + (clickedY - cy) * (clickedY - cy)) > settings.disk.diameter / 2) {
							name = '';
							isDiskFilled = false;
							return false;
						}else {
							setCookie(row, col, name, 3);
							cells[row][col] = name;
                   			return true;
						}
            	}
            	else {
            		isDiskFilled = false;
            		return false;
            	}
        	}

        	//Get the row, column and color name from the cookie and set it on the other browser.
        	function addDiskFromStorage(row, col, name) {
        		cells[row][col] = name;
        		drawDisks();
        		if(name == 'red')
        			isCurrentPlayerRed = false;
        		else
        			isCurrentPlayerRed = true;
        	}

        	//Set the cookie value into the local storage
        	function setCookie(row, col, playerName, gameState) {
        		if(localStorage) {
        			localStorage.setItem('row', row);
        			localStorage.setItem('col', col);
        			localStorage.setItem('playerName', playerName);
        			localStorage.setItem('gameState', gameState);
        		}
        		isEventHandled = false;
        	}

        	//Get the column value from the clicked X co-ordinate
        	function getCol(e) {
        		var rect = canvas.getBoundingClientRect(),
        			   x = e.clientX - rect.left;
        		return Math.floor(Math.abs(x / (settings.disk.diameter + (settings.disk.padding * 2))));

        	}

        	//Get the row value from the clicked Y co-ordinate
        	function getRow(e) {
        		var rect = canvas.getBoundingClientRect(),
        			   y = e.clientY - rect.bottom;
        		return Math.floor(Math.abs( y / (settings.disk.diameter + (settings.disk.padding * 2))));
        	}

        	//Reset the rectange canvas
        	function reset() {
        		context.clearRect(0, 0, canvas.width, canvas.height);
        	}

        	//Draws the fade on the canvas, when the winner is found
        	function drawFade() {
	            context.shadowOffsetX = 0;
	            context.shadowOffsetY = 0;
	            context.shadowBlur = 0;
	            context.fillStyle = "rgba(255, 255, 255, 0.5)";
	            context.fillRect(0, 0, canvas.width, canvas.height);
        	}

        	//Draws the text on the faded canvas, when the winner is found
	        function drawText(text, fill, stroke) {
	            drawFade();
	            context.fillStyle = fill;
	            context.strokeStyle = stroke;
	            context.font = settings.text.size + "px " + settings.text.font;
	            context.shadowColor = stroke;
	            context.shadowOffsetX = 3;
	            context.shadowOffsetY = 3;
	            context.shadowBlur = 8;
	            var x = (canvas.width - context.measureText(text).width) / 2,
	                y = canvas.height / 2;
	            context.fillText(text, x, y);
	            context.font = settings.text.size / 2 + "px " + settings.text.font;
	            var restart = "Click to restart";
	            context.fillText(restart, (canvas.width - context.measureText(restart).width) / 2, canvas.height - settings.text.padding)
	        }

	        //Identify the winner from the response received from the response received
	        function identifyWinner() {
	            if (winner == disk.red.name)
	                drawText("Red wins", disk.red.fill, disk.red.stroke);
	            else if (winner == disk.yellow.name)
	                drawText("Yellow wins", disk.yellow.fill, disk.yellow.stroke);
	        }

	        //Reset the cell matrix and set and reset the required flags for the program
	        function resetBoard() {
	            isCurrentPlayerRed = true;
	            winner = '';
	            isGameOver = true;
	            setCookie(0, 0, '', 0);
	            for (var row = 0; row < cells.length; row++) {
	                for (var col = 0; col < cells[row].length; col++) {
	                    cells[row][col] = '';
	                }
	            }
	        }

	        //Get the XMLHttpRequest/ActiveXObject depending on the browser, send null if not supported
        	function getRequestObject()	{
				if (window.ActiveXObject) { //IE5, IE6
					return(new ActiveXObject("Microsoft.XMLHTTP"));
				} else if (window.XMLHttpRequest) {//IE7+, Firefox, Chrome
					return(new XMLHttpRequest());
				} else {
					return(null);
				}
			}

			//Prepares the GET request and sends the request to the server and waits for the response
        	function sendServerRequest(row, col, player_id) {
        		var url = "http://localhost:9001/gameserver.py";
        		var params = "?row=" + row + "&col=" + col + "&player_id=" + player_id;
        		request = getRequestObject();
        		if(request !== null){
        			request.onreadystatechange = handleResponse;
	        		request.onerror = handleError;
	        		request.open("GET", url + params, true);
	        		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	        		request.send(null);
        		}else {
        			alert("Cannot send request. Browser does not support the capability.")
        		}
        	}

        	//Handles the response received from the GET request and handle it accordingly. If the received gameState is 1,
        	//player one is the winner, if the gameState is 2, player two is the winner. If anything else, continue with the game.
        	//Set the cookie value if a winner is found for the browser window to know about it.
        	function handleResponse() {
				if (request.readyState == 4 && request.status == 200) {
					var gameState = request.responseText;
					if(gameState == 1){
						winner = disk.red.name;
						setCookie(0, 0, disk.red.name, gameState);
					}else if(gameState == 2){
						winner = disk.yellow.name;
						setCookie(0, 0, disk.red.name, gameState);
					}else{
						winner = '';
					}
					identifyWinner();
				}
			}

			//Send alert if the server throws an exception
			function handleError(e) {
				alert("Server Connection Failure/Slow connection with Server. Please start the server/wait for the server to respond.")
			}

        	drawDisks();

        	//Refresh the board state on the client and server, if the page is refereshed.
        	$(window).bind('beforeunload',function(){
        		resetBoard();
				sendServerRequest(0, 0, 0);
				setCookie(0, 0, '', 0);
			});

        	//Listen to any changes made in storage and handle it accordingly. If the gameState is 3, it displays the disk
        	//added on the other browser on the current browser. If the gameState is 2, the player two is the winer, the
        	//screen displays yellow is the winner, if the gameState is 1, the screen displays red is the winner. If the 
        	//gameState is 0, it resets the board state on the client and the server both.
        	window.addEventListener('storage', function(e){
    			var gameState = localStorage.getItem('gameState');
    			if (gameState == 3){
    				reset();
        			var row = localStorage.getItem('row');
	        		var col = localStorage.getItem('col');
	        		var playerName = localStorage.getItem('playerName');
	        		addDiskFromStorage(row, col, playerName);
        		}else if(gameState == 2 && isEventHandled !== true){
        			winner = disk.yellow.name;
        			identifyWinner();
        			isEventHandled = true;
        		}else if(gameState == 1 && isEventHandled !== true){
        			winner = disk.red.name;
        			identifyWinner();
        			isEventHandled = true;
        		}else if(gameState == 0){
        			reset();
        			resetBoard();
        			sendServerRequest(0, 0, 0);
        			drawDisks();
        			isGameOver = false;
        			isDiskFilled = true;
        		}

        	}, false)

        	//Listens to the click event on the canvas. It checks who is the current player and accordingly makes the
        	//decision on what needs to be done. It also checks if the game is over or not. If the game is over, it sends
        	//a request to the server for reseting the board state at the server level as well. If the game is not over, it
        	//sends the required row, column and player ID details to send a request to the server.
        	//1 - playerID for red
        	//2 - playerID for yellow
			canvas.addEventListener('click', function(e) {
				if(winner != ''){
					resetBoard();
				} else {
					var rect = canvas.getBoundingClientRect();
					var clickedX = Math.abs(e.clientX - rect.left);
					var clickedY = Math.abs(e.clientY - rect.bottom);
					var player_id;
					reset();
					if(isCurrentPlayerRed) {
						addDisk(getRow(e), getCol(e), clickedX, clickedY, disk.red.name);
						if (!isDiskFilled){
							drawDisks();
							alert('Illegitimate move performed. Please click correctly inside the circles.');
							reset();
						}else
							isCurrentPlayerRed = false;
						player_id = 1;
					} else {
						addDisk(getRow(e), getCol(e), clickedX, clickedY, disk.yellow.name);
						if (!isDiskFilled){
							drawDisks();
							alert('Illegitimate move performed. Please click correctly inside the circles.');
							reset();
						}else 
							isCurrentPlayerRed = true;
						player_id = 2;
					}
				}
				if(isGameOver){
					reset();
					isGameOver = false;
					sendServerRequest(0, 0, 0);
				}else if(isDiskFilled)
					sendServerRequest(getRow(e), getCol(e), player_id);
				drawDisks();
				isDiskFilled = true;
			}, false);
    };
}(jQuery));