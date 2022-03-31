SULIFA - Rock Paper Scissors for 2 
----------------------

### Description
This project allows only for two people to play the game of rock paper scissors. The game doesn't show the choice the other player made until both made a choice. The game for now doesn't allow any further changes to make if a choice was made. After both players make a choice, teh game shows the winner and both choices and after 3 seconds empties everything and players can start again.

### Implementation

At first, it was hard to figure out how to display only one of the player's choice. To solve this prolem I decided to have a bunch of if/else statements in the display and also dsave the userid in the program saved. In the server side, I saved all of the users that connect in an array and delete those that disconnect. The first two users that connect are allowed to play, others don't really do anything, just watch. 

After I implemented the main logic of communication and only the logic of the game was left. Checking whether somebody is a winner or anything else should be done by communicating with the server. Since I needed to get the omjis of another player, I had to send the emojis from client to server with an index, identifier and then save them in teh server. After that, I had to send it to the client back, so that we can check the win on the client side and display the winner. 

### NEXT STEPS
* Creating rooms for more people to play
* Allow up yo 6 people rooms, so that there would be longer rounds to win
* Add point systems
