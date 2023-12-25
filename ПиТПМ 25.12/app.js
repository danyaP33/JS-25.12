var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
var jsonParser = bodyParser.json();

app.use(express.static(__dirname + '/public'));
// получение списка данных
app.get('/api/products', function (req, res) {
    var content = fs.readFileSync('products.json', 'utf8');
    var products = JSON.parse(content);
    res.send(products);
});
// получение одного пользователя по id
app.get('/api/products/:id', function (req, res) {
    var id = req.params.id; // получаем id
    var content = fs.readFileSync('products.json', 'utf8');
    var products = JSON.parse(content);
    var product = null;
    // находим в массиве пользователя по id
    for (var i = 0; i < products.length; i++) {
        if (products[i].id == id) {
            product = products[i];
            break;
        }
    }
    // отправляем пользователя
    if (product) {
        res.send(product);
    } else {
        res.status(404).send();
    }
});
// получение отправленных данных
app.post('/api/products', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    var productName = req.body.name;
    var productPrice = req.body.price;
    var product = { name: productName, price: productPrice };

    var data = fs.readFileSync('products.json', 'utf8');
    var products = JSON.parse(data);

    // находим максимальный id
    var id = Math.max.apply(
        Math,
        products.map(function (o) {
            return o.id;
        })
    );
    // увеличиваем его на единицу
    product.id = id + 1;
    // добавляем пользователя в массив
    products.push(product);
    var data = JSON.stringify(products);
    // перезаписываем файл с новыми данными
    fs.writeFileSync('products.json', data);
    res.send(product);
});
// удаление пользователя по id
app.delete('/api/products/:id', function (req, res) {
    var id = req.params.id;
    var data = fs.readFileSync('products.json', 'utf8');
    var products = JSON.parse(data);
    var index = -1;
    // находим индекс пользователя в массиве
    for (var i = 0; i < products.length; i++) {
        if (products[i].id == id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        // удаляем пользователя из массива по индексу
        var product = products.splice(index, 1)[0];
        var data = JSON.stringify(products);
        fs.writeFileSync('products.json', data);
        // отправляем удаленного пользователя
        res.send(product);
    } else {
        res.status(404).send();
    }
});
// изменение пользователя
app.put('/api/products', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    var productId = req.body.id;
    var productName = req.body.name;
    var productPrice = req.body.price;

    var data = fs.readFileSync('products.json', 'utf8');
    var products = JSON.parse(data);
    var product;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id == productId) {
            product = products[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if (product) {
        product.price = productPrice;
        product.name = productName;
        var data = JSON.stringify(products);
        fs.writeFileSync('products.json', data);
        res.send(product);
    } else {
        res.status(404).send(product);
    }
});

app.listen(3000, function () {
    console.log('Сервер ожидает подключения...');
});