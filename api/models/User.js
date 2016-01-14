/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true,
  attributes: {

    name: {
      type:'string'
      //required:true
    },
    title: {
      type: 'string'
    },
    email: {
      type: 'string',
      //required: true,
      email:true,
      unique:true
    },
    encryptedPassword:{
      type:'string'
    },
    facebookId: {
      type: 'string',
      required: true,
      unique: true
    }
    
    ,
    toJSON: function(){
    var obj=this.toObject();
    delete obj.password;
    delete obj.encryptedPassword;
    delete obj._csrf;
    return obj;
    }

    
  },
  beforeCreate: function(values,next){


    if(!values.password)return next({err:["Password Invalid"]});

    require('bcrypt').hash(values.password,10, function passwordEncrypted(err,encryptedPassword){

      if(err) return next(err);
      values.encryptedPassword=encryptedPassword;
      next();
    });
  }


};

