import BaseHTTPServer
#from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import urlparse
#import urllib.parse

hostName = ""
hostPort = 9001
htmlpage = """ <html><head><title>Web Page</title></head><body>Hello Python World</body></html>"""
notfound = "File not found"

#This class accepts request from the game client, processes it and then sends back the appropriate response according to the game state.
#Request received
#0 - reset board matrix back to initial state
#Anything else - process it and send back the game state
#responses sent
#0 - game continue, winner not decided.
#1 - player one won
#2 - player two won
class MyServer(BaseHTTPServer.BaseHTTPRequestHandler):
#class MyServer(BaseHTTPRequestHandler):
    #Receive GET request and send response
    def do_GET(self):
        if ("gameserver.py" in self.path):
            #Get row number from the request
            #row = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query).get('row', None)[0]
	    row = urlparse.parse_qs(urlparse.urlparse(self.path).query).get('row', None)[0]
            #Get column number from the request
            #col = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query).get('col', None)[0]
	    col = urlparse.parse_qs(urlparse.urlparse(self.path).query).get('col', None)[0]
            #Get player id from the request
            #playerID = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query).get('player_id', None)[0]
	    playerID = urlparse.parse_qs(urlparse.urlparse(self.path).query).get('player_id', None)[0]
            #If player Id is 0, reset the board state back to the initial state
            if(playerID == '0'):
                gameState = 0
                resetBoardMatrix()
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                #self.wfile.write(bytes(str(gameState), 'UTF-8'))
		self.wfile.write(str(gameState))
            #If player Id is anything else, process it, evaluate the move and send back the response
            else:
                gameState = evaluateMove(row, col, playerID)
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                #self.wfile.write(bytes(str(gameState), 'UTF-8'))
    	        self.wfile.write(str(gameState))
        else:
           self.send_error(404, notfound)
#Set 1 or 2 at the row and column of the matrix according to the player Id received from the request
def setMatrixIndexValue(row, col, playerID):
    if boardMatrix[int(row)][int(col)] == 0:
        if playerID == '1':
            boardMatrix[int(row)][int(col)] = 1
        else:
            boardMatrix[int(row)][int(col)] = 2 
    #for i in range(19):
    #   for j in range(19):
    #       print boardMatrix[i][j],
    #   print
#This method evaluates the move, whether the game should continue or to declare any winner.
def evaluateMove(row, col, playerID):
    setMatrixIndexValue(row, col, playerID)
    for i in range(19):
        for j in range(19):
            if(boardMatrix[i][j] == 1):
                if(checkVertical(i, j, playerID) or checkHorizontal(i, j, playerID) or checkDiagonal1(i, j, playerID) or checkDiagonal2(i, j, playerID)):
                    isPlayerOneWin = 1
                    return 1
            if(boardMatrix[i][j] == 2):
                if(checkVertical(i, j, playerID) or checkHorizontal(i, j, playerID) or checkDiagonal1(i, j, playerID) or checkDiagonal2(i, j, playerID)):
                    isPlayerTwoWin = 1
                    return 2
    return 0
#This method checks if the clicked circles are 5 in a row vertically
def checkVertical(x, y, playerID):
    verCounter = 0
    if(playerID == '1' and boardMatrix[x][y] == 1):
        for i in range(x+1, min(x+5,19)):
            if(boardMatrix[i][y] == 1):
                verCounter += 1
                #print("Ver= ",boardMatrix[i][y]," ", i," ", y," ", verCounter)
            else:
                break
    if(playerID == '2' and boardMatrix[x][y] == 2):
        for i in range(x+1, min(x+5,19)):
            if(boardMatrix[i][y] == 2):
                verCounter += 1
                #print("Ver= ",boardMatrix[i][y]," ", i," ", y," ", verCounter)
            else:
                break
    if(verCounter == 4):
        #print("Vertical check confirmed")
        return True
    else:
        return False
#This method checks if the clicked circles are 5 in a row horizontally
def checkHorizontal(x, y, playerID):
    horCounter = 0
    if(playerID == '1' and boardMatrix[x][y] == 1):
        for j in range(y+1, min(y+5,19)):
            if(boardMatrix[x][j] == 1):
                horCounter += 1
                #print("Hor= ",boardMatrix[x][j]," ", x," ", j," ", horCounter)
            else:
                break
    if(playerID == '2' and boardMatrix[x][y] == 2):
        for j in range(y+1, min(y+5,19)):
            if(boardMatrix[x][j] == 2):
                horCounter += 1
                #print("Hor= ",boardMatrix[x][j]," ", x," ", j," ", horCounter)
            else:
                break
    if(horCounter == 4):
        #print("Horizontal check confirmed")
        return True
    else:
        return False
#This method checks if the clicked circles are 5 in a row right diagonally
def checkDiagonal1(x, y, playerID):
    diaCounter1 = 0
    if(playerID == '1' and boardMatrix[x][y] == 1):
        for k,m in zip(range(x+1,min(x+5,19)), range(y+1, min(y+5,19))):
            if(boardMatrix[k][m] == 1):
                diaCounter1 += 1
                #print("D1= ",boardMatrix[k][m]," ", k," ", m," ", diaCounter1)
            else:
                break
    if(playerID == '2' and boardMatrix[x][y] == 2):
        for k,m in zip(range(x+1, min(x+5,19)), range(y+1, min(y+5,19))):
            if(boardMatrix[k][m] == 2):
                diaCounter1 += 1
                #print("D1= ",boardMatrix[k][m]," ", k," ", m," ", diaCounter1)
            else:
                break
    if(diaCounter1 == 4):
        #print("Diagonal1 check confirmed")
        return True
    else:
        return False
#This method checks if the clicked circles are 5 in a row left diagonally
def checkDiagonal2(x, y, playerID):
    diaCounter2 = 0
    if(playerID == '1' and boardMatrix[x][y] == 1):
        for k,m in zip(range(x+1,min(x+5,19)), range(y-1, max(y-5,-1), -1)):
            if(boardMatrix[k][m] == 1):
                diaCounter2 += 1
                #print("D2= ",boardMatrix[k][m]," ",k, " ",m," ", diaCounter2)
    if(playerID == '2' and boardMatrix[x][y] == 2):
        for k,m in zip(range(x+1,min(x+5,19)), range(y-1, max(y-5,-1), -1)):
            if(boardMatrix[k][m] == 2):
                diaCounter2 += 1
                #print("D2= ",boardMatrix[k][m]," ", k," ", m," ", diaCounter2)
    if(diaCounter2 == 4):
        #print("Diagonal2 check confirmed")
        return True
    else:
        return False
#This method resets the board state back to a zero matrix
def resetBoardMatrix(): 
    global boardMatrix
    boardMatrix = [[0 for i in range(19)] for j in range(19)]
    print("Board Reseted.")

#The matrix which stores the current state of the board
boardMatrix = [[0 for i in range(19)] for j in range(19)]
isPlayerOneWin = 0
isPlayerTwoWin = 0

myServer = BaseHTTPServer.HTTPServer((hostName, hostPort), MyServer)
#myServer = HTTPServer((hostName, hostPort), MyServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass
except ConnectionAbortedError:
    resetBoardMatrix()

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))