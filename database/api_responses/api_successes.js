exports.successToken = function(success, message, token){
  var res = {
    success: success,
    message: message,
    token: token
   }
  return res;
};

exports.successQuery = function(success, message){
  var res = {
    success: success,
    message: message
   }
  return res;
};
