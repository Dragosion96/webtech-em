var express = require("express")
var Sequelize = require("sequelize")
var nodeadmin = require("nodeadmin")
var cors = require("cors")

//connect to mysql database
var sequelize = new Sequelize('songs', 'root', '', {
    dialect:'mysql',
    host:'localhost'
})

sequelize.authenticate().then(function(){
    console.log('Success')
})

//define a new Model
var Categories = sequelize.define('categories', {
    name: Sequelize.STRING,
    description: Sequelize.STRING
})

var Songs = sequelize.define('songs', {
    name: Sequelize.STRING,
    category_id: Sequelize.INTEGER,
    description: Sequelize.STRING,
    price: Sequelize.INTEGER,
    image: Sequelize.STRING
})

Songs.belongsTo(Categories, {foreignKey: 'category_id', targetKey: 'id'})
//Categories.hasMany(Products)

var app = express()

app.use('/nodeamin', nodeadmin(app))

//access static files
app.use(express.static('public'))
app.use('/admin', express.static('admin'))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(cors())

// get a list of categories
app.get('/categories', function(request, response) {
    Categories.findAll().then(function(categories){
        response.status(200).send(categories)
    })
        
})

// get one category by id
app.get('/categories/:id', function(request, response) {
    Categories.findOne({where: {id:request.params.id}}).then(function(category) {
        if(category) {
            response.status(200).send(category)
        } else {
            response.status(404).send()
        }
    })
})

//create a new category
app.post('/categories', function(request, response) {
    Categories.create(request.body).then(function(category) {
        response.status(201).send(category)
    })
})

app.put('/categories/:id', function(request, response) {
    Categories.findById(request.params.id).then(function(category) {
        if(category) {
            category.update(request.body).then(function(category){
                response.status(201).send(category)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/categories/:id', function(request, response) {
    Categories.findById(request.params.id).then(function(category) {
        if(category) {
            category.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/songs', function(request, response) {
    Songs.findAll(
        {
            include: [{
                model: Categories,
                where: { id: Sequelize.col('songs.category_id') }
            }]
        }
        
        ).then(
            function(songs) {
                response.status(200).send(songs)
            }
        )
})

app.get('/songs/:id', function(request, response) {
    Songs.findById(request.params.id).then(
            function(song) {
                response.status(200).send(song)
            }
        )
})

app.post('/songs', function(request, response) {
    Songs.create(request.body).then(function(song) {
        response.status(201).send(song)
    })
})

app.put('/songs/:id', function(request, response) {
    Songs.findById(request.params.id).then(function(song) {
        if(song) {
            song.update(request.body).then(function(song){
                response.status(201).send(song)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/songs/:id', function(request, response) {
    Songs.findById(request.params.id).then(function(song) {
        if(song) {
            song.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/categories/:id/songs', function(request, response) {
    Songs.findAll({where:{category_id: request.params.id},
            include: [{
                model: Categories,
                where: { id: Sequelize.col('songs.category_id') }
            }]
        }).then(
            function(songs) {
                response.status(200).send(songs)
            }
        )
})

app.listen(8080)