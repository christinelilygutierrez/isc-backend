# isc-backend
Backend of the Lucid Agency Ideal Seating Chart application for the database and ideal seating chart algorithm. It uses the express-generator to create the app.

# How to Configure
1. Install nodejs v5.2.0 from [https://nodejs.org/en/](https://nodejs.org/en/)
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
2. Now your database should be configured properly. In order to run the app, do the following. In the terminal, go the isc-backend directory.   ```cd isc-backend  && npm start ```
3. View the pages in a web broswer on `http://localhost:3001`

# Bin
This folder contains www the sets up the port for the server as 3001 and makes app.js the entry point of the application.

# Database
The database folder contains two APIs:
 1. A query API that returns JSON objects of queries or alters the database called queries.js
 2. A RESTful API that updates the webpages at [http://localhost:3001](http://localhost:3001) from the database


# Node Modules
This folder contains all of the dependencies used in the backend application such as MySQL, jade parser, RESTful API calls, etc.

# Routes
This folder contains all of the javascript files that render the webpages in the application.

# Views
This folder contains all of the webpages for the application. The app uses jade template engine to render HTML pages.

# Working Code Samples
This is a temporary folder to keep working code so that any problematic changes can be reverted


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


