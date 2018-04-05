use aktionera; # Byt till din egen

# Radera om redan finns
drop table bid;
drop table ad;
drop table user;

create table user (
       user_id int NOT NULL AUTO_INCREMENT,
       name varchar(64),
       address varchar(128),
	email varchar(128),
	PRIMARY KEY (user_id)
);


create table ad(
       ad_id int NOT NULL AUTO_INCREMENT,
       user int,
       name varchar(128),
       description TEXT,
       price int,
       category varchar(64),
       date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       file_name text,
       FOREIGN KEY(user) REFERENCES user(user_id),
       PRIMARY KEY(ad_id)
);

create table bid (
       bid_id int NOT NULL AUTO_INCREMENT,
       price int,
       ad int,
       user int,
       date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY(ad) REFERENCES ad(ad_id),
       FOREIGN KEY(user) REFERENCES user(user_id),
       PRIMARY KEY (bid_id)
);



Insert into user (name, address, email) values ("Nicole", "Vtuna", "niccan@vtuna.se");

Insert into ad (user, name, description, price, category, file_name) values (1, "Kitten", "A cute litte kitten, 2 months old.", 33, "pet", "cutecat.jpg");
