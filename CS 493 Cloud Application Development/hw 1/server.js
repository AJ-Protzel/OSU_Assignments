// npm run dev
// Insomnia

const express = require('express')
const app = express()
const port = process.env.PORT || 8000

app.use(express.json())

app.use(function (req, res, next) {
    console.log("== Request received")
    console.log("  - METHOD:", req.method)
    console.log("  - URL:", req.url)
    console.log("  - HEADERS:", req.headers)
    next()
})

app.get('/', function (req, res, next) {
    res.status(200).send({
        msg: "OK!!"
    })
})


// Tests done on Insomnia

// Add business:
app.post('/businesses', function(req, res, next){
    console.log("  - req.body:", req.body)
    if(req.body && 
       req.body.name && 
       req.body.address && 
       req.body.city && 
       req.body.state && 
       req.body.zip && 
       req.body.phone && 
       req.body.category && 
       req.body.subCategory){
        res.status(201).send({
            id: '12345'
        })
    } else{
        res.status(400).send({
            err: "Request needs a JSON body with more information."
        })
    }
})
// http://localhost:8000/businesses
// {
// 	"name": "Rainbow Stones",
// 	"address": "123 Taco st.",
// 	"city": "Upsville",
// 	"state": "YA",
// 	"zip": "98765",
// 	"phone": "1-444-6666",
// 	"category": "Restaurant",
// 	"subCategory": "Burgers"
// }

// Modify business:
app.patch('/businesses/:id', function(req, res, next){
    console.log("  - req.body:", req.body)
    var id = req.params.id
    res.status(201).send({
        id: id
    })
})
// http://localhost:8000/businesses/2
// {
// 	"name": "Rainbow Stones",
// 	"address": "432 Burrito vil.",
// 	"city": "Upsville",
// 	"state": "YA",
// 	"zip": "98765",
// 	"phone": "1-444-6666",
// 	"category": "Restaurant",
// 	"subCategory": "Burgers"
// }

// Remove business:
app.delete('/businesses/:id', function(req, res, next){
    console.log("  - req.body:", req.body)
    var id = req.params.id
    res.status(201).send({
        id: id
    })
})
// http://localhost:8000/businesses/1

// List businesses:
app.get('/businesses', function(req, res, next){
    res.status(200).send({
        businesses: [
            {
                id: "1",
                name: "Big Burger",
                address: "123 Taco st.",
                city: "Upsville",
                state: "YA",
                zip: "98765",
                phone: "1-444-6666",
                category: "Restaurant",
                subCategory: "Burgers",
                website: "Null",
                email: "Null"
            },
            {
                id: "2",
                name: "Gnome Depot",
                address: "123 Wood row",
                city: "Upsville",
                state: "CA",
                zip: "98765",
                phone: "1-444-6667",
                category: "Warehouse",
                subCategory: "Gardening",
                website: "Null",
                email: "Null"
            },
            {
                id: "3",
                name: "Pest Solutions",
                address: "321 Burger st.",
                city: "Downsville",
                state: "YA",
                zip: "98765",
                phone: "1-333-5555",
                category: "Restaurant",
                subCategory: "Tacos",
                website: "Null",
                email: "Null"
            },
            {
                id: "4",
                name: "Mortus's Mortuary",
                address: "666 River rd.",
                city: "Stix",
                state: "OR",
                zip: "64832",
                phone: "1-444-6969",
                category: "Morturary",
                subCategory: "Null",
                website: "Null",
                email: "Null"
            },
            {
                id: "5",
                name: "Frog Depot",
                address: "3 Wednesday ct.",
                city: "Mydude",
                state: "YA",
                zip: "98555",
                phone: "1-435-2617",
                category: "Warehouse",
                subCategory: "Clothing",
                website: "Null",
                email: "Null"
            }
        ]
    })
})
// http://localhost:8000/businesses

// List business details:
app.get('/businesses/:id', function (req, res, next){
    console.log("  - req.params:", req.params)
    const id = req.params.id
    if(id === '1'){
        res.status(200).send({
            id: "1",
            name: "Big Burger",
            address: "123 Taco st.",
            city: "Upsville",
            state: "YA",
            zip: "98765",
            phone: "1-444-6666",
            category: "Restaurant",
            subCategory: "Burgers",
            website: "Null",
            email: "Null"
        })
    } else{
        next()
    }
})
// http://localhost:8000/businesses/1
// BAD: http://localhost:8000/businesses/6

// Write review:
app.post('/reviews', function(req, res, next){
    console.log("  - req.body:", req.body)
    if(req.body && 
       req.body.bsId && 
       req.body.star && 
       req.body.price && 
       req.body.body){
        res.status(201).send({
            id: '12345'
        })
    } else{
        res.status(400).send({
            err: "Request needs a JSON body with more information."
        })
    }
})
// http://localhost:8000/reviews
// {
//     "bsId": "2",
//     "star": "5",
//     "price": "$$$$",
//     "body": "it was alright"
//  }

// Modify review:
app.patch('/reviews/:id', function(req, res, next){
    console.log("  - req.body:", req.body)
    var id = req.params.id
    res.status(201).send({
        id: id
    })
})
// http://localhost:8000/reviews/1
// {
//     "usrId": "1",
//   "bsId": "2",
//   "star": "1",
//   "price": "$$",
//   "body": "it was alright"
// }

// Delete review:
app.delete('/reviews/:id', function(req, res, next){
    console.log("  - req.body:", req.body)
    var id = req.params.id
    res.status(201).send({
        id: id
    })
})
// http://localhost:8000/reviews/2

// Add photo:
app.post('/photos', function(req, res, next){
    console.log("  - req.body:", req.body)
    if(req.body &&
        req.body.usrId && 
        req.body.bsId && 
        req.body.url &&
        req.body.caption){
        res.status(201).send({
            id: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9tZXN0aWMlMjBjYXR8ZW58MHx8MHx8&w=1000&q=80'
        })
    } else{
        res.status(400).send({
            err: "Request needs a JSON body with more information."
        })
    }
})
// http://localhost:8000/photos
// {
//     "usrId": "2",
//   "bsId": "1",
//   "url": "https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9tZXN0aWMlMjBjYXR8ZW58MHx8MHx8&w=1000&q=80",
//    "caption": "Dis a dog"
// }

// Delete photo:
app.delete('/photos/:id', function(req, res, next){
    console.log("  - req.body:", req.body)
    var usrId = req.params.usrId
    res.status(201).send({
        id: usrId
    })
})
// http://localhost:8000/photos/3

// List owned businesses:
app.get('/businesses/:usrId', function (req, res, next){
    console.log("  - req.params:", req.params)
    const usrId = req.params.usrId
    if(usrId === 'user1'){
        res.status(200).send({
            user1: [
                {
                    id: "3",
                    name: "Pest Solutions",
                    address: "321 Burger st.",
                    city: "Downsville",
                    state: "YA",
                    zip: "98765",
                    phone: "1-333-5555",
                    category: "Restaurant",
                    subCategory: "Tacos",
                    website: "Null",
                    email: "Null"
                },
                {
                    id: "4",
                    name: "Mortus's Mortuary",
                    address: "666 River rd.",
                    city: "Stix",
                    state: "OR",
                    zip: "64832",
                    phone: "1-444-6969",
                    category: "Morturary",
                    subCategory: "Null",
                    website: "Null",
                    email: "Null"
                }
            ]
        })
    }
    else if(usrId === 'user2'){
        res.status(200).send({
            user2: [
                {
                    id: "1",
                    name: "Big Burger",
                    address: "123 Taco st.",
                    city: "Upsville",
                    state: "YA",
                    zip: "98765",
                    phone: "1-444-6666",
                    category: "Restaurant",
                    subCategory: "Burgers",
                    website: "Null",
                    email: "Null"
                },
                {
                    id: "2",
                    name: "Gnome Depot",
                    address: "123 Wood row",
                    city: "Upsville",
                    state: "CA",
                    zip: "98765",
                    phone: "1-444-6667",
                    category: "Warehouse",
                    subCategory: "Gardening",
                    website: "Null",
                    email: "Null"
                },
                {
                    id: "3",
                    name: "Pest Solutions",
                    address: "321 Burger st.",
                    city: "Downsville",
                    state: "YA",
                    zip: "98765",
                    phone: "1-333-5555",
                    category: "Restaurant",
                    subCategory: "Tacos",
                    website: "Null",
                    email: "Null"
                }
            ]
        })
    } else{
        next()
    }
})
// http://localhost:8000/businesses/user2

// List own reviews:
app.get('/reviews/:usrId', function (req, res, next){
    console.log("  - req.params:", req.params)
    const usrId = req.params.usrId
    if(usrId === 'user1'){
        res.status(200).send({
            user1: [
                {
                    "bsId": "3",
                    "star": "1",
                    "price": "$",
                    "body": "test333232"
                },
                {
                    "bsId": "5",
                    "star": "2",
                    "price": "$$",
                    "body": "text2"
                },
                {
                    "bsId": "2",
                    "star": "3",
                    "price": "$$$",
                    "body": "ya i had the BEANS"
                }
            ]
        })
    }
    else if(usrId === 'user2'){
        res.status(200).send({
            user2: [
                {
                    "bsId": "1",
                    "star": "5",
                    "price": "$$$$",
                    "body": "hated it"
                },
                {
                    "bsId": "1",
                    "star": "1",
                    "price": "$$$$",
                    "body": "loved it"
                }
            ]
        })
    } else{
        next()
    }
})
// http://localhost:8000/reviews/user1

// List own photos:
app.get('/photos/:usrId', function (req, res, next){
    console.log("  - req.params:", req.params)
    const usrId = req.params.usrId
    if(usrId === 'user1'){
        res.status(200).send({
            user1: [
                {
                    bsId: "2",
                    url: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9tZXN0aWMlMjBjYXR8ZW58MHx8MHx8&w=1000&q=80', 
                    caption: "Dat not a dog"
                },
                {
                    bsId: "2",
                    url: 'https://media.npr.org/assets/img/2015/05/04/pig-tales_9780393240245-1-_wide-ff64be1d4945228dd4bf7f4a10cbc7b08ff9ada5-s1100-c50.jpg', 
                    caption: "Dis is a cat"
                }
            ]
        })
    }
    else if(usrId === 'user2'){
        res.status(200).send({
            user2: [
                {
                    bsId: "3",
                    url: 'https://images.unsplash.com/photo-1615789591457-74a63395c990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZG9tZXN0aWMlMjBjYXR8ZW58MHx8MHx8&w=1000&q=80', 
                    caption: "text 3"
                },
                {
                    bsId: "4",
                    url: 'https://media.npr.org/assets/img/2015/05/04/pig-tales_9780393240245-1-_wide-ff64be1d4945228dd4bf7f4a10cbc7b08ff9ada5-s1100-c50.jpg', 
                    caption: "text 4"
                }
            ]
        })
    } else{
        next()
    }
})
// http://localhost:8000/photos/user1



app.use('*', function (req, res, next) {
    res.status(404).send({
        err: "404: This URL was not recognized: " + req.originalUrl
    })
})

app.use(function (err, req, res, next) {
    console.log("  - err:", err)
    res.status(500).send()
})

app.listen(port, function () {
    console.log("== Server is listening on port:", port)
})
