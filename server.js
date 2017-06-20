var express = require('express');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var app = express();

app.use(bodyParser.json());
app.use(express.static('public')); 
mongoose.connect('mongodb://localhost:27017/mittens');

var Meow = mongoose.model('Meow', {
 text: String
  });

app.get('/meows', function(req,res,next){
  Meow.find({}, function(err, meows){
    return res.json(meows);
  });
});

app.post('/meows', function(req, res, next){	
		var newMeow = new Meow({
			text: req.body.newMeow		
		});
		newMeow.save(function(err){
			return res.send("Added Successfully");
	});	
});

app.put('/meows/remove', function(req, res, next){	
var meowId=req.body.meow._id;		
		Meow.remove({_id: meowId}, function(err){
			return res.send("Deleted Successfully");
	});
});

var User = mongoose.model('User', { username: String, password: String  });

// app.post('/users', function(req, res, next){		
// 		var newUser= new User({
// 				username: req.body.username,
// 				password: req.body.password
// 			});
// 			newUser.save( function(err){
// 			return res.send();
// 		});		
// 	}) ;	
var bcrypt = require('bcryptjs');
app.post('/users', function(req, res, next){	
	bcrypt.genSalt(10, function(err,salt){
		bcrypt.hash(req.body.password,salt,function(err,hash){
			var newUser= new User({
				username: req.body.username,
				password: hash
			});
			newUser.save( function(err){
			return res.send();
	});
		});
	}) ;
});

var jwt = require('jwt-simple');
var JWT_SECRET='catsmeow';

app.put('/users/signin', function(req,res,next){
	User.findOne({username:req.body.username}, function(err,user){
		bcrypt.compare(req.body.password, user.password, function(err, result){
			if(result){
				var token  = jwt.encode(user, JWT_SECRET);
				return res.json({token:token});
			}else{
				return res.status(400).send();
			}
		});
	});
});


app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
});


