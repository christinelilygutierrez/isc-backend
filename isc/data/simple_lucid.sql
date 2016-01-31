drop database if exists lucid_users;

create database lucid_users;

use  lucid_users;

create table employees(
id int auto_increment not null,
uuid varchar(64),
username varchar(100) not null,
password varchar(100) not null,
primary key (id)
);