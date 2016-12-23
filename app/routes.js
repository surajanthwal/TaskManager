//including the mysql module for db operations
var mysql = require("mysql");

// creating connection to the db using credentials
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "masterig",
    database: "taskManagement"
});

//connection message will be logged as soon as it is established
con.connect(function (err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');
});

//for handling all the requests from client
module.exports = function (app) {

    //Read operation for both tasks and lists
    app.get('/listsAndTasks', function (req, res) {
        var respArray = [];
        con.query('SELECT lists.id as id,lists.title as title, tasks.id as tId,tasks.title as tTitle FROM lists INNER JOIN tasks ON tasks.listId=lists.id', function (err, rows) {
            if (err) throw err;
            console.log('Data received from Db:\n');
            console.log(rows);
            var obj = {};
            obj.tasks = [];
            var task = {};
            for (var i = 0; i < rows.length; i++) {

                if (i == 0) {
                    obj.id = rows[i].id;
                    obj.title = rows[i].title;
                    task.id = rows[i].tId;
                    task.title = rows[i].tTitle;
                    obj.tasks.push(task);
                } else {
                    if (rows[i].id == rows[i - 1].id) {
                        task = {};
                        task.id = rows[i].tId;
                        task.title = rows[i].tTitle;
                        obj.tasks.push(task);

                    } else {
                        respArray.push(obj);
                        obj = {};
                        obj.tasks = [];
                        task = {};

                        obj.id = rows[i].id;
                        obj.title = rows[i].title;
                        task.id = rows[i].tId;
                        task.title = rows[i].tTitle;
                        obj.tasks.push(task);
                    }


                }
                if (i == rows.length - 1) {
                    respArray.push(obj);
                }

            }
            res.send(respArray);
        });
    });

    //Create operation for List
    app.post('/createList', function (req, res) {
        con.query('INSERT INTO lists SET ?', req.body, function (err, results) {
            if (err) throw err;
            res.send('hogya kaam');
        });
    });

    //Create operation for Task
    app.post('/createTask', function (req, res) {
        con.query('INSERT INTO tasks SET ?', req.body, function (err, results) {
            if (err) throw err;
            res.send('hogya kaam');
        });
    });

    //Update operation for list
    app.post('/updateList', function (req, res) {
        var jsonObject = req.body;
        con.query('UPDATE lists SET title = ? Where iD = ?', [req.body.title, req.body.id], function (err, results) {
            if (err) throw err;
            res.send('hogya kaam');
        });
    });

    //Update operation for task
    app.post('/updateTask', function (req, res) {
        var jsonObject = req.body;
        con.query('UPDATE tasks SET title = ?,listId = ? Where iD = ?', [req.body.title, req.body.listId, req.body.id], function (err, results) {
            if (err) throw err;
            res.send('hogya kaam');
        });
    });

    //Delete operation for List
    app.post('/deleteList', function (req, res) {
        con.query('DELETE FROM lists WHERE id = ?', [req.body.id], function (err, result) {
            if (err) throw err;
            res.send('hogya kaam');
        });

    });

    //Delete operation for task
    app.post('/deleteTask', function (req, res) {
        var jsonObject = req.body;
        con.query('DELETE FROM tasks WHERE id = ?', [req.body.id], function (err, result) {
            if (err) throw err;
            res.send('hogya kaam');
        });

    });

//serving initial file from server which is index.html
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });
    
};