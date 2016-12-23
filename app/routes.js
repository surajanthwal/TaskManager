var User = require('./models/user');
var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "masterig",
    database: "taskManagement"
});
con.connect(function (err) {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }
    console.log('Connection established');

});

// con.end(function(err) {
//     // The connection is terminated gracefully
//     // Ensures all previously enqueued queries are still
//     // before sending a COM_QUIT packet to the MySQL server.
// });

module.exports = function (app) {

    app.post('/registerUser', function (req, res) {
        var object = req.body;
        console.log(object.data);
        User.find({firstName: object.data.firstName}, function (err, users) {
            if (err) {
                console.log(err);
            }
            else {
                // object of all the users
                if (users.length != 0) {
                    console.log(users);
                    res.json("There exists a user by this name. Please choose another name");
                } else {
                    console.log("Saving user");
                    var newUser = User({
                        firstName: object.data.firstName,
                        lastName: object.data.lastName,
                        age: object.data.age,
                        dob: object.data.dob,
                        gender: object.data.gender,
                        phone: object.data.phone,
                        description: object.data.description
                    });

                    newUser.save(function (err, user) {
                        if (err) {
                            console.log("err");
                            res.json("err aaagya" + err);
                        } else {
                            console.log('User saved successfully!!!!');
                            res.json("User saved successfully");
                        }
                    });
                }
            }
        });


    });


    app.get('/allUsers', function (req, res) {
        User.find({}, function (err, users) {
            if (err) throw err;

            console.log(users);
            res.json(users);
        });
    });

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

        var jsonObject = req.body;

        con.query('INSERT INTO lists SET ?', req.body, function (err, results) {
            if (err) throw err;

            res.send('hogya kaam');
        });
    });

   //Create operation for Task
    app.post('/createTask', function (req, res) {

        var jsonObject = req.body;

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


    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });


};


// for (var i = 0; i < respArray.length; i++) {
//     console.log(respArray[i].id + " " + respArray[i].title);
//     console.log(respArray[i].tasks);
//     // for (var j = 0; j < respArray[i].tasks.length; j++) {
//     //     // console.log(respArray[i].tasks[j]);
//     // }
//
// }