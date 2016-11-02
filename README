Author:
Varun Sharma

Filename:
index.html - main game page
js/gameclient.js - javascript client
gameserver.py - python server

How to run:
Copy the files into a folder of your choice. Do not change the way the files and the directory are listed together.

	Client:
	On the terminal run "firefox index.html &"
				or
	Double-click on the index.html

	Server:
	On the terminal run "python gameserver.py"

Please note that the server needs to be running for the game to run fine.

How to use:
To play the game:
	- The first player is always red. Select a circle you want to click on the canvas. Then wait for the other player to complete his/her move on a different tab.
	- The goal of the game is to have 5 reds/yellows in a row horizontally, vertically, left diagonally and right diagonally.
	- Once the game is decided, you can click on the canvas to restart the game, or you can refresh the page to restart the game.
There are some screenshots available. Use them for better understanding of how the game works.

Interface:
	Server:
		- Class MyServer:
		This class accepts request from the game client, processes it and then sends back the appropriate response according to the game state.
		Request received
		0 - reset board matrix back to initial state
		Anything else - process it and send back the game state
		Responses sent
		0 - game continue, winner not decided.
		1 - player one won
		2 - player two won

			- do_GET:
			Receive GET request and send response.

		- setMatrixIndexValue:
		Set 1 or 2 at the row and column of the matrix according to the player Id received from the request.

		- evaluateMove:
		This method evaluates the move, whether the game should continue or to declare any winner.

		- checkVertical:
		This method checks if the clicked circles are 5 in a row vertically.

		- checkHorizontal:
		This method checks if the clicked circles are 5 in a row horizontally.

		- checkDiagonal1:
		This method checks if the clicked circles are 5 in a row right diagonally.

		- checkDiagonal2:
		This method checks if the clicked circles are 5 in a row left diagonally.

		- resetBoardMatrix:
		This method resets the board state back to a zero matrix.

	Client:
		- Main function (has no name):
		This is the main function which is called when the page is loaded. This function is responsible for handling the client game events
		and behave as requied.

		- drawCircle:
		Draw the circles on the canvas.

		- drawDisk:
		Fill in the details for the circle, like center-X, center-Y, color fill, and color stroke.

		- drawDisks:
		Draws the disks for the entire cell matrix.

		- addDisk:
		Evaluate the clicked point, check if it is a legitimate point and if it is a legitimate point, set the matrix element color. Also set the cookie value for the multi-browser session.

		- addDiskFromStorage:
		Get the row, column and color name from the cookie and set it on the other browser.

		- setCookie:
		Set the cookie value into the local storage.

		- getCol:
		Get the column value from the clicked X co-ordinate.

		- getRow:
		Get the row value from the clicked Y co-ordinate.

		- reset:
		Reset the rectange canvas.

		- drawFade:
		Draws the fade on the canvas, when the winner is found.

		- drawText:
		Draws the text on the faded canvas, when the winner is found.

		- identifyWinner:
		Identify the winner from the response received from the response received.

		- resetBoard:
		Reset the cell matrix and set and reset the required flags for the program.

		- getRequestObject:
		Get the XMLHttpRequest/ActiveXObject depending on the browser, send null if not supported.

		- sendServerRequest:
		Prepares the GET request and sends the request to the server and waits for the response.

		- handleResponse:
		Handles the response received from the GET request and handle it accordingly. If the received gameState is 1, player one is the winner, if the gameState is 2, player two is the winner. If anything else, continue with the game. Set the cookie value if a winner is found for the browser window to know about it.

		- handleError:
		Send alert if the server throws an exception.

		- $(window).bind('beforeunload',function():
		Refresh the board state on the client and server, if the page is refereshed.

		- window.addEventListener('storage', function(e):
		Listen to any changes made in storage and handle it accordingly. If the gameState is 3, it displays the disk added on the other browser on the current browser. If the gameState is 2, the player two is the winer, the screen displays yellow is the winner, if the gameState is 1, the screen displays red is the winner. If the gameState is 0, it resets the board state on the client and the server both.

		- canvas.addEventListener('click', function(e):
		Listens to the click event on the canvas. It checks who is the current player and accordingly makes the decision on what needs to be done. It also checks if the game is over or not. If the game is over, it sends a request to the server for reseting the board state at the server level as well. If the game is not over, it sends the required row, column and player ID details to send a request to the server.
        1 - playerID for red
        2 - playerID for yellow

Limitations:
	- The code is not the most efficient code and sometimes it takes time to get results from the server or even display the changes made in the other browser on the current browser.
	- The hostname and ports of the servers are hardcoded into the server and client files. The client cannot be parametrized, that's why the server hostname and port needed to be hardcoded.

Screenshots:
There is a screenshot directory which can help a user on how to play the game.