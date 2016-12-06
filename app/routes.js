var User = require('./models/user');

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
    
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); 
    });

};
