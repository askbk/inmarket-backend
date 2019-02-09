USE inmarket_db;

INSERT INTO user (name, email, phone, kommuneNr, adminLevel, password,
    createTime, userType, profilePicture)
    VALUES ("ask", "ask@ask.no", "12345678", "1567", 0, "passord123", NOW(), 0, "img/stock-profile.jpg");
