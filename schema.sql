drop database if exists battledb;
create database battledb;
use battledb;

create table User (
    `user_id` int(11) not null primary key auto_increment,
    `username` varchar(255) not null,
    `password` varchar(255) not null
);

create table Party (
    `party_id` int(11) not null primary key auto_increment,
    `user_id` int(11),
    `color` varchar(255)
);

create table BattleSpread (
    `spread_id` int(11) not null primary key auto_increment,
    `spread` text
);

create table BattleAction (
    `action_id` int(11) not null primary key auto_increment,
    `spread_id` int(11),
    `name` varchar(255),
    `type` varchar(255),
    `speed` int(11),
    `range` int(11),
    `power` int(11),
    'shape' varchar(255),
    `targetSelf` int(11)
);

create table JobClass (
    `jobclass_id` int(11) not null primary key auto_increment,
    `name` varchar(11)
);

create table JobClass_BattleAction (
    `id` int(11) not null primary key auto_increment,
    `action_id` int(11),
    `jobclass_id` int(11)
);

create table BattleUnit (
    `unit_id` int(11) not null primary key auto_increment,
    `jobclass_id` int(11),
    `party_id` int(11),
    `sprite` int(11)
);

insert into User (`username`, `password`) values
("jeremy","asdfasdf"),
("cpu","asdfasdf");

insert into Party (`user_id`, `color`) values
(1, "#0000FF"),
(2, "#FF0000");

insert into BattleSpread (`spread`) values
("[[1,0],[0,1],[-1,0],[0,-1]]");

insert into BattleAction (`spread_id`, `name`, `type`, `speed`, `range`, `power`) values 
(1,"Bash","melee",-1,1,5),
(1,"Wind Up","melee",5,1,20);

insert into JobClass (`jobclass_name`) values
("Squire");

insert into JobClass_BattleAction (`action_id`, `jobclass_id`) values
(1, 1);

insert into BattleUnit (`jobclass_id`, `party_id`, `sprite`) values
(1, 1, 0x1F601),
(1, 1, 0x1F602),
(1, 1, 0x1F603),
(1, 1, 0x1F604),
(1, 2, 0x1F601),
(1, 2, 0x1F602),
(1, 2, 0x1F603),
(1, 2, 0x1F604);
