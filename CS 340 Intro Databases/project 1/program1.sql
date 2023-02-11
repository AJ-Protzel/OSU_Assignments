
-- URL: http://web.engr.oregonstate.edu/~protzela/cs340/index.php

-- Functions and Procedures were added through phpmyadmin and its GUI

-- 2. InitDeptStats() -- initializer procedure (EXPORTED)
DELIMITER $$
CREATE DEFINER=`cs340_protzela`@`%` PROCEDURE `InitDeptStats`()
BEGIN
	INSERT INTO `DEPT_STATS` (`Dnumber`, `Emp_count`, `Avg_salary`) 
    SELECT Dno, count(Ssn) AS "Number of Employees", AVG(Salary) AS "Average Salary"
    FROM `EMPLOYEE`
    
    GROUP BY Dno ASC;
END$$
DELIMITER ;

-- 3. [ ]DeptStats -- updates DEPT_STATS after DELETE / INSERT / UPDATE -- Same procedure for each one (EXPORTED)
CREATE TRIGGER `DELETEDeptStats` AFTER DELETE ON `EMPLOYEE`
 FOR EACH ROW UPDATE `DEPT_STATS`
	SET 
    	`Emp_count` = (SELECT COUNT(Ssn) FROM `EMPLOYEE` WHERE Dnumber = Dno), 
        `Avg_salary` = (SELECT AVG(Salary) FROM `EMPLOYEE`  WHERE Dnumber = Dno)

-- 4. Error check over 40 working hours for project insert (EXPORTED)
CREATE TRIGGER `MaxTotalHours` BEFORE INSERT ON `WORKS_ON`
 FOR EACH ROW BEGIN
	DECLARE total integer;
	DECLARE perror VARCHAR(200);
	
	SELECT SUM(Hours) INTO total
	FROM `WORKS_ON`
	WHERE Essn = NEW.Essn;
    
	IF((NEW.Hours > 40) OR (total + NEW.Hours > 40)) THEN
		SET perror = concat('You entered ', NEW.Hours, '. You currently work ', total, '. You are over 40 hours.');
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = perror;
	END IF;
END

-- 5. Function to return 'average' based on salary to average in department (EXPORTED)
DELIMITER $$
CREATE DEFINER=`cs340_protzela`@`%` FUNCTION `PayLevel`(`SSN` INT) RETURNS varchar(30) CHARSET utf8
    NO SQL
BEGIN
	DECLARE sal DECIMAL(10,2);
    DECLARE ave DECIMAL(10,2);
    
    SELECT Salary INTO sal
    	FROM `EMPLOYEE` E
        WHERE E.Ssn = SSN;
    
    SELECT Avg_salary INTO ave
		FROM `DEPT_STATS` D
		LEFT JOIN `EMPLOYEE` E ON D.Dnumber = E.Dno 
        	WHERE E.Ssn = SSN;
    
	SET @Output = CASE
		WHEN sal > ave THEN ('Above Average')
        WHEN sal < ave THEN ('Below Average')
        ELSE ('Average') END;

	RETURN @Output;
END$$
DELIMITER ;

