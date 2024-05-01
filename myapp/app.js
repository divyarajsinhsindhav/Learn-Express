const express = require('express')
const users = require('./MOCK_DATA.json')
const fs = require('fs');
const app = express()

const port = 3000

app.use(express.urlencoded({ extended: false }));

//GET all users
app.get('/api/users', (req, res) => {
    try {
        return res.status(200).json(users)
    } catch(e) {
        throw Error('Error while getting users')
    }
});

app.route('/api/users/:id')
    .get((req, res) => {
        //Dynamic Path Parameters
        try {
            const id = Number(req.params.id)
            const user = users.find(user => user.id === id);
            return res.status(200).json(user)
        } catch(e) {
            throw Error('Error while getting user')
        }
    })
    .patch((req, res) => {
        //PATCH - Update the user
        /**
         * PUT vs PATCH
         * PUT : PUT method typically replaces the entire resource with the new one provided
         * PATCH : PATCH method is used to apply partial modifications to a resource 
         */
        try {
            const id = Number(req.params.id)
            const user = users.find((user) => user.id === id) 
            //Object.assign => It returns the modified target object. (user is source & req.body is target)
            Object.assign(user, req.body)
            fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
                return res.status(200).json({ status: 'Success', id: id })
            })
        } catch(e) {
            throw Error('Error while update the user')
        }
    })
    .delete((req, res) => {
        //DELETE the user
        try {
            const id = Number(req.params.id)
            const index = users.findIndex((user) => user.id === id)
            //array.splice() use for remove the element from the give index, second argumet is number of element to remove
            users.splice(index, 1)
            fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
                return res.status(204).json({ status: 'Success', id: id })
            })
        } catch(e) {
            throw Error('Error while delete the user')
        }
    });

//POST - Create the user
app.post('/api/users', (req, res) => {
    try {
        const body = req.body; //request body
        users.push({ id : users.length+1, ...body}) //push body into user
        //Write MOCK_DATA.json file
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
            return res.status(201).json({ status: "Success", id: users.length}); 
        });
    } catch(e) {
        throw Error('Error while create the user')
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});