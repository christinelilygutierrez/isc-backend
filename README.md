# isc-backend
Backend of the Lucid Agency Ideal Seating Chart application for the database and ideal seating chart algorithm. It uses the express-generator to create the app.

# Organization
.
├── app.js
├── bin
│   └── www
├── database
│   ├── queries.js
│   └── render_api.js
├── env.js
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   │   ├── all.js
│   └── stylesheets
│       └── style.css
├── node_modules
├── README.md
├── routes
│   └── index.js
├── views
│   ├── add_employee.jade
│   ├── clusters.jade
│   ├── desks.jade
│   ├── edit_employee.jade
│   ├── employees.jade
│   ├── error.jade
│   ├── index.jade
│   └── layout.jade
└──  working code samples
   └── app.js

# How to Configure
1. Install nodejS v5.2.0 from [https://nodejs.org/en/](https://nodejs.org/en/)
2. Install express generator using the following command 
   ```
   npm install express-generator -g
   ```
3. Install [git](https://git-scm.com/) and clone this repository 
   ``` 
   git clone https://github.com/garrettgutierrezasu/isc-backend.git
   ```
4. Set default python in case you have both python 2 and python 3 versions on your computer 
   ```
   npm config set python python2.7
   ```
5.  Using the terminal go to isc-backend directory.
   ```bash 
   cd isc-backend
   
   npm install
   ```

# How to Run
This prototype of the backend was tested using a local instance of MySQL on my machine. In order for yours to run correctly, make the following changes in `env.js`.
1. Edit the *hostname*, *username*, *password*, *port number*, and *database name* to suit your mysql instance 
2. Now your database should be configured properly. In order to run the app, do the following. In the terminal, go the isc-backend directory.
   ```
   cd isc-backend
   npm start
   ```
3. View the pages in a web broswer on `http://localhost:3001`

# Bin
This folder contains www the sets up the port for the server as 3001 and makes app.js the entry point of the application.

# Database
The database folder contains two APIs:
 1. A query API that returns JSON objects of queries or alters the database called queries.js
 2. A RESTful API that updates the webpages at http://localhost:3001 from the database


# Node Modules
This folder contains all of the dependencies used in the backend application such as MySQL, jade parser, RESTful API calls, etc.

# Routes
This folder contains all of the javascript files that render the webpages in the application. The only file in here for now is index.js. This routes and renders the home page. The other webpages are rendered in app.js for now for the RESTful API, but I can change that later.

# Views
This folder contains all of the webpages for the application. By default, express-generator uses jade files so I stuck with that for now. App.js uses a parse to convert the jade template engine into HTML pages.

# Working Code Samples
This is a temporary folder where I keep working code so that my changes can be reverted if I mess up something with app.js or any other file.

# Other Notes
This backend uses routes and views for testing the connection to the database. In reality, they are not needed for the project since we have isc-management. The main goal is to use isc-management to make API calls to this project. I do not know how to do that so I am hoping Jeff can take a look and see if it can be done. If this project is unusable, feel free to scrap it and make a working model. This is my first attempt at using any type of framework and I wanted to see if I could help in some way.


# Using Docker
This assumes that you have installed [Docker](https://www.docker.com/) 
* Go to the root of isc-server and execute the following commands to build the docker image

```docker
docker build -t webapp .
```

* Then stop and remove all the containers using the following two commands 

```docker
docker stop $(docker ps -a -q)

docker rm $(docker ps -a -q)
```

* Run the following command to start mysql  instance 

```docker
docker run -e MYSQL_ROOT_PASSWORD=admin --name isc-mysql -d -p=3306:3306 mysql
```

* After finishing then start our app using the following command 

```docker 
docker run -it -p=80:80 --link isc-mysql:mysql --name isc-server -d webapp
```

* Use the following ip address  `192.168.99.100:3306` to connect to mysql 
* Connect to mysql using  mysql workbench and run the script `database.sql` to create database
* To check the running containers execute
```docker
docker ps
```
* To connect to the container execute 
```docker 
docker exec -i -t isc-server bash
```
* To view the site go to ip `192.168.99.100` 


