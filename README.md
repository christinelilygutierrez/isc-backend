# isc-backend
Backend of the Lucid Agency Ideal Seating Chart application for the database and ideal seating chart algorithm. It uses the express-generator to create the app.

# Organization
.
├── app.js
├── bin
│   └── www
├── database
|   ├── queries.js
|   └── render_api.js
├── package.json
├── public
│   ├── images
│   ├── javascripts
    |   ├── all.js
│   └── stylesheets
│       └── style.css
├── node_modules
├── README.md
├── routes
│   └── index.js
├── views
|   ├── add_employee.jade
|   ├── clusters.jade
|   ├── desks.jade
|   ├── edit_employee.jade
|   ├── employees.jade
|   ├── error.jade
|   ├── index.jade
|   └── layout.jade
└──  working code samples
   └── app.js

# How to Configure
1.) Install Node.JS from https://nodejs.org/en/ v5.2.0
2.) Install express generator
 2.1) Enter the command prompt and type the following:
 2.2) npm install -g express-generator
3.) Using the terminal, go to isc-backend directory.
 3.1) cd isc-backend
4.) Install dependencies
 4.1) npm install

# How to Run
This prototype of the backend was tested using a local instance of MySQL on my machine. In order for yours to run correctly, make the following changes:
1.) In app.js, go to line 43 and change the password to the password for your instance of MySQL
 1.1) Change host, user, port, and database accordingly if needed.
2.) In /database/queries.js change host, user, port, and database accordingly if needed.

Now your database should be configured properly. In order to run the app, do the following.
3.) In the terminal, go the isc-backend directory.
 3.1) cd isc-backend
4.) Start using npm.
 4.1) npm start
5.) View the pages in a web broswer.
 5.1) http://localhost:3000
 
# Bin
This folder contains www the sets up the port for the server as 3000 and makes app.js the entry point of the application.

# Database
The database folder contains two APIs:
  1.) A query API that returns JSON objects of queries or alters the database called queries.js
  2.) A RESTful API that updates the webpages at http://localhost:3000 from the database
I did not know which one we needed for the project, so I added both just in case. I can easily expand on both to have more queries.

# Node Modules
This folder contains all of the dependencies used in the backend application such as MySQL, jade parser, RESTful API calls, etc.

# Routes
This folder contains all of the javascript files that render the webpages in the application. The only file in here for now is index.js. This routes and renders the home page. The other webpages are rendered in app.js for now for the RESTful API, but I can change that later.

# Views
This folder contains all of the webpages for the application. By default, express-generator uses jade files so I stuck with that for now. App.js uses a parse to convert the jade template engine into HTML pages.

# Working Code Samples
This is a temporary folder where I keep working code so that my changes can be reverted if I mess up something with app.js or any other file.

# Other Notes
This backend uses routes and views for testing the connection to the database. In reality, the are not needed for the project since we have isc-management. The main goal is to use isc-management to make API calls to this project. I do not know how to do that so I am hoping Jeff can take a look and see if it can be done. If this project is unusable, feel free to scrap it and make a working model. This is my first attempt at using any type of framework and I wanted to see if I could help in some way.
