-- drop TABLE users;
-- drop TABLE list;
-- drop TABLE item;
-- drop TABLE template;
-- drop TABLE household;
-- drop TABLE user_household;
-- drop TABLE list_item;
-- drop TABLE category;
-- drop TABLE list_share;

CREATE TABLE users (
    id          serial PRIMARY KEY,
    username    varchar(40) NOT NULL,
    firstname   varchar(128) NOT NULL,
    lastname    varchar(128) NOT NULL,
    email       varchar(256) NOT NULL,
    country     char(2) NOT NULL,
    password    char(32) NOT NULL,
    salt        char(32) NOT NULL
);

CREATE TABLE lists (
    id          serial PRIMARY KEY,
    name        varchar(128) NOT NULL,
    templateID  integer DEFAULT 0,
    userID      integer NOT NULL,
    shared      boolean DEFAULT FALSE
);

CREATE TABLE items (
    id          serial PRIMARY KEY,
    name        varchar(256) NOT NULL,
    categoryID  integer DEFAULT 0
);

CREATE TABLE templates (
    id          serial PRIMARY KEY,
    name        varchar(128) NOT NULL,
    listID      integer NOT NULL
);

CREATE TABLE households (
    id          serial PRIMARY KEY,
    name        varchar(128) NOT NULL
);

CREATE TABLE user_household (
    userID      integer NOT NULL,
    householdID integer NOT NULL
);

CREATE TABLE list_item (
    listID      integer NOT NULL,
    itemID      integer NOT NULL
);

CREATE TABLE categories (
    id          serial PRIMARY KEY,
    name        varchar(120)
);

CREATE TABLE list_share (
    listID      integer NOT NULL,
    userID      integer,
    householdID integer,
    startDate   date NOT NULL,
    endDate     date
);