/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt=require('bcrypt');
module.exports = {
	
	new:function(req,res){
		// req.session.authentication
		// console.log(req.session);
		 res.view('session/new');	
	},
	create:function(req,res,next){

		console.log(req.params.all());
		if(!req.param('email') || !req.param('password')){
			console.log("###");
			var usernamepasswordrequireerror =[{name: 'usernamePasswordRequired', message:'You must enter both username and password'}]

			req.session.flash={
				err:usernamepasswordrequireerror
			}
			
			res.redirect('/session/new');
			return ;

		}
		User.findOneByEmail(req.param('email'),function(err,user){
			console.log("%%%"+user);
			if(err) return next(err);
			 if(!user){
			 	var emailinvalid=[{name: 'noAccount'}]
			 	req.session.flash={
			 		err: emailinvalid
			 	}
			 	
			 	res.redirect('/session/new');
			 }

			 bcrypt.compare(req.param('password'),user.encrytedPassword , function(err,valid){//Error here!!on encrytped password generation//
			 	console.log("$$$");
			 	if(err) return next(err);

			 	if(!valid){
			 		var usernamepasswordmismatch=[{name:'usernamepasswordMismatch', message:'Invalid user and pass combo'}]
			 		req.session.flash={

			 			err:usernamepasswordmismatch
			 		}
			 		res.redirect('/session/new');
			 		return;
			 	}
			 	
			 	req.user.authenticated=true;
			 	req.session.User=user;


			 	res.redirect('/user/show'+user.id);

			 });

		});




	}
};

