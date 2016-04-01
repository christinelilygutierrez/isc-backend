exports.errors = function(code, codeError ){
  var res = {
     status : code.toString(),
     message: codeError.toString()
   }
  return res;
};

exports.successError = function(success, codeError ){
  var res = {
     success : success,
     message: codeError.toString()
   }
  return res;
};

exports.queryError = function(code, codeError, data){
  var res = {
     status : code.toString(),
     message: codeError.toString(),
     data: data
   }
  return res;
};
