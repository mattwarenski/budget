
--Tables 
CREATE TABLE expenses (id INTEGER PRIMARY KEY,
                      name VARCHAR(150) NOT NULL,
                      date DATETIME NOT NULL, 
                      amount DECIMAL(10,5) NOT NULL, 
                      categoryId INTEGER NOT NULL, 
                      accountId NOT NULL,
                      splitId INTEGER);

CREATE TABLE accounts (id INTEGER PRIMARY KEY,
                      name VARCHAR(50), 
                      bank VARCHAR(50), 
                      ballance DECIMAL(10,5) NOT NULL DEFAULT 0);


CREATE TABLE categories (id INTEGER PRIMARY KEY, 
                       name VARCHAR(50), 
                       parentId INTEGER, 
                       budget_amount DECIMAL(10,5), 
                       duration INTEGER, 
                       durationUnit VARCHAR(1));



