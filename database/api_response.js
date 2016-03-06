exports.errors = function(bValue, message){
  var res = {
     error : bValue,
      message: message
   };
  return res;
};

exports.success=function(obj){
  var res= {
    error: false,
    result: obj
  };
  return res;
};
