var queries = require('../database/all_queries');
var routes = require('../routes/index');

/************************** Global Variables **********************/
var dbconnect = queries.getConnection();
var emps;
var pairs = [];
var pairScores = [];

/************************** Global Funcions **********************/
function pluckByID(inArr, ID) {
  console.log('pluckByID', arguments);
  for (var i = 0; i < inArr.length; i++ ) {
    if (inArr[i].employeeID === ID) {
      return true;
    }
  }
  return false;
};

function callTeam(ID1, ID2, score, total, officeID) {
  console.log('callTeam', arguments);
  queries.getAllTeammatesForOneEmployee(dbconnect, ID1, function(err, data1) {
    queries.getAllTeammatesForOneEmployee(dbconnect, ID2, function(err, data2) {
      if(pluckByID(data1, ID2) || pluckByID(data2, ID1)) {
        score+=7;
      } else {
        score+=0;
      }
      callBlackList(ID1, ID2, score, total, officeID);
    });
  });
};

function callBlackList(ID1, ID2, score, total, officeID) {
  console.log('callBlackList', arguments);
  queries.getAllBlacklistEmployeesForOneEmployee(dbconnect, ID1, function(err, data1) {
    queries.getAllBlacklistEmployeesForOneEmployee(dbconnect, ID2, function(err, data2) {
      if(pluckByID(data1, ID2) || pluckByID(data2, ID1)) {
        score -= 5;
      } else{
        score+=0;
      }
      callWhiteList(ID1, ID2, score, total, officeID);
    });
  });
};

function callWhiteList(ID1,ID2, score, total, officeID) {
  console.log('callWhiteList', arguments);
  queries.getAllWhitelistEmployeesForOneEmployee(dbconnect, ID1, function(err, data1) {
    queries.getAllWhitelistEmployeesForOneEmployee(dbconnect, ID2, function(err, data2) {
      if(pluckByID(data1, ID2) || pluckByID(data2, ID1)) {
        score+=6
      }
      var pushing={emp1: ID1,
        emp2: ID2,
        score: score};
        pairScores.push(pushing);
        if (pairScores.length === total) {
          console.log("Office "+officeID+" updated similarity.");
          var fs = require('fs');
          fs.writeFile('seating_chart_algorithm/similarity_files/'+officeID+'_similarity.json', JSON.stringify(pairScores), function(err) {
            if (err) {
              console.log("Error writing JSON similarity_files");
              console.log(err);
            }
          })
          //write the file
        }
      });
    });
  }
  exports.Start= function(callback) {
    console.log('Start', arguments);
    queries.getAllOffices(dbconnect, function(err, data) {
      console.log('queries.getAllOffices', arguments);
      var offices=data;
      if (!offices || offices.length === 0) {
        return callback('No offices to search');
      }
      offices.forEach(function(office, key) {
        console.log('offices.forEach', arguments);
        queries.getAllEmployeesForOneOfficeConfidential(dbconnect, office.officeID, function(err, data) {
          console.log('queries.getAllEmployeesForOneOfficeConfidential', arguments);
          if (err) {
            return console.error(err); // continue to next office iteration
          }
          emps = data;
          var total = ((emps.length * (emps.length -1))/2);
          var good = false;
          var time = 60*15*1000;

          for (var i = 0; i < emps.length; i++ ) {
            var temp=emps[i].accountUpdated;
            var sqldate=new Date(temp);
            var result=((new Date) - sqldate);

            if (result < time) {
              good=true;
            }
          }
          // if(good) {
            //var total=(emps.length * (emps.length -1))/2;
            emps.forEach(function(emp1, key) {
              console.log('emps1.forEach', arguments);
              emps.forEach(function(emp2, key) {
                console.log('emps2.forEach', arguments);
                if(emp1.employeeID===emp2.employeeID) {
                } else{
                  var score = 0;
                  var currentPair1='('+emp1.employeeID+','+emp2.employeeID+')';
                  var currentPair2='('+emp2.employeeID+','+emp1.employeeID+')';
                  if (pairs.indexOf(currentPair1) === -1 && pairs.indexOf(currentPair2) === -1) {
                    pairs.push(currentPair1);
                    //
                    //Restroom usage
                    //
                    score+=10-Math.abs(emp1.restroomUsage-emp1.restroomUsage);

                    //
                    //Noise
                    //
                    score+=10-Math.abs(emp1.noisePreference-emp2.noisePreference);

                    //
                    //Out of Desk
                    //
                    score+=10-Math.abs(emp1.outOfDesk-emp2.outOfDesk);
                    callTeam(emp1.employeeID, emp2.employeeID, score, total, office.officeID);
                  }
                }
              });
            });
          // }
          // console.log('not good');
        });
      });
    });
  };
