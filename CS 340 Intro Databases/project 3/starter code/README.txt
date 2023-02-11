This is a small walkthrough to set up the code for Program 3 CS 340.
For any questions you can ask Apples on discord.

This zip file has been stripped to the essentials of what is needed for this program, 
    it is based on the Starterfiles.zip and what was shown on Tuesdays lecture video.
A style.css, and .js files have been given however they only have default content, it is simply linked for you to edit.
If set up properly, you should see the landing index.html page on your browser 
    in which you can click the link and see your EMPLOYEE table displayed on your browser.

To get started:

1. Extract files into CS340 folder on ENGR.

2. In a terminal, cd to the folder containing these files and type in the following:
    // (the first two are necessary, the others are recommended if errors occur.)
    npm install
    npm install forever

    npm install express --save
    npm install express-handlebars --save
    npm install handlebars --save
    npm install body-parser --save

3. Edit the dbcon.js file with your credentials.

4. To run the code:
    1. Type "hostname" without "" to get which flip server you are on (1, 2, 3).
    2. Type node main.js "Port number"
        - Replace "Port number" with a random number (recommended in the 5000-8000's).
    3. Open a browser and go the URL: http://flip#.engr.oregonstate.edu:####/
        - Replace the first # with the flip server number you got from hostname.
        - Replace the second set of #### with the port number you ran the main.js with.
        
5. Type ctrl^c in the terminal to end the server.

6. To run in forever mode for turn in type: ./node_modules/forever/bin/forever start main.js "Port number"
