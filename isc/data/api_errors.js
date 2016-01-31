exports.errors=function(code, codeError ){
  var res = {
     status : code.toString(),
     message: codeError.toString()
   }
  return res;
};
