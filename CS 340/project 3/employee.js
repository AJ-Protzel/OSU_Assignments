module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getProjects(res, mysql, context, complete){
        mysql.pool.query('SELECT Pnumber, Pname FROM PROJECT', function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.projects = results;
            complete();
        });
    }

    function getEmployees(res, mysql, context, complete){
        mysql.pool.query('SELECT Ssn, Fname, Lname, Salary, Dno FROM EMPLOYEE', function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee = results;
            complete();
        });
    }

    function getByProject(req, res, mysql, context, complete){
        var query = "SELECT Ssn, Fname, Lname, Salary, Dno, WO.Pno FROM EMPLOYEE E, WORKS_ON WO WHERE WO.Essn = E.Ssn AND Pno = ?";
        var inserts = [req.params.project]
        mysql.pool.query(query, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee = results;
            context.PNO = results[0].Pno;
            complete();
        });
    }

    function getProjectInfo(req, res, mysql, context, complete){
        var query2 = "SELECT Pname, Pnumber, Plocation FROM PROJECT WHERE Pnumber = ?";
        var inserts2 = [req.params.project]
        mysql.pool.query(query2, inserts2, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Projectname = results[0].Pname;
            context.Projectlocation = results[0].Plocation;
            complete();
        });
    }

    function getByName(req, res, mysql, context, complete){
        var query = "SELECT Ssn, Fname, Lname, Salary, Dno FROM EMPLOYEE WHERE Fname LIKE " + mysql.pool.escape(req.params.s + '%');
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.employee = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterEmployee.js", "searchEmployee.js"];
        var mysql = req.app.get('mysql');
        getEmployees(res, mysql, context, complete);
        getProjects(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('employee', context);
            }
        }
    });

    router.get('/filter/:project', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterEmployee.js", "searchEmployee.js"];
        var mysql = req.app.get('mysql');
        getByProject(req, res, mysql, context, complete);
        getProjectInfo(req, res, mysql, context, complete);
        getProjects(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('employee', context);
            }
        }
    });

    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["filterEmployee.js", "searchEmployee.js"];
        var mysql = req.app.get('mysql');
        getByName(req, res, mysql, context, complete);
        getProjects(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('employee', context);
            }
        }
    });

    return router;
}();