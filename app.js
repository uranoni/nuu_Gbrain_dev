var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
}));

app.route('/signup')
	.post(function(req,res){
	console.log(req.body);
	res.send('Post OK');
});
app.listen(3000, function () {
    console.log('Listen Port 3000!');
});
