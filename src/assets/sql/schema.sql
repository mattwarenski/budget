
--Tables 

CREATE TABLE account (id INTEGER PRIMARY KEY,
                      name VARCHAR(50), 
                      bank VARCHAR(50), 
                      ballance DECIMAL(10,5) NOT NULL DEFAULT 0);


CREATE TABLE category (id INTEGER PRIMARY KEY, 
                       name VARCHAR(50), 
                       parentId INTEGER, 
                       budget_amount DECIMAL(10,5), 
                       duration INTEGER, 
                       durationUnit VARCHAR(1));


INSERT INTO account (name, bank, ballance) VALUES ('account 1', 'bank of america', 34.45);


