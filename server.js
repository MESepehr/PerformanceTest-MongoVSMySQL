console.log("Helo server");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var mysql = require('mysql');
  
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "performanceTest"
});

var manyData = [{ name: "Company Inc", address: "Highway 37" ,phone:"09434832"}];
manyData=[];
var total = 10000 ;
for(var i = 0 ; i<total ; i++)
{
    manyData.push({name:randomName(),adress:randomAdress(),phone:Math.floor(Math.random()*10000000000),school:Math.floor(i/(total/4))+1,class:Math.floor(i/(total/40))+1})
}

function randomName()
{
    var str = String.fromCharCode(65+Math.floor(Math.random()*25));
    var nameL = Math.floor(Math.random())*10+5;
    for(var i = 0 ; i <nameL ; i++)
    {
        str+=String.fromCharCode(97+Math.floor(Math.random()*25))
    }
    return str ;
}

function randomAdress()
{
    return randomName()+' '+randomName()+' '+randomName();
}

var tim ;


insertMongo();
function insertMongo()
{
  
  
  tim = new Date().getTime();
  MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    console.log("Database created!");
    var dbo = db.db("mydb");
    /*dbo.createCollection("customers", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });*/
    //var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("customers2").insertMany(manyData, function(err, res) {
      if (err) throw err;
      console.log(res.insertedCount+" document inserted: "+res.result.ok);
      db.close();

      console.log('* Insert tooks : '+(new Date().getTime()-tim));

      sqlInsert();
    });
  });
};


//////////////////////////MySQL


function sqlInsert()
{
  console.log('\n\n**********************mySQL***********************\n\n')

  
  
  
  var insertQueryString = "INSERT INTO customers2 (name, adress,phone,school,class) VALUES ";
  var insertData=[];
  
  for(i = 0 ; i<manyData.length ; i++)
  {
      insertQueryString = insertQueryString+"(?,?,?,?,?),";
      insertData.push(manyData[i].name,manyData[i].address,manyData[i].phone,manyData[i].school,manyData[i].class);
  }
  
  insertQueryString = insertQueryString.substring(0,insertQueryString.length-1);
  //console.log(insertQueryString);
  
  tim = new Date().getTime();
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mySQL!");
    var sql = insertQueryString;
    con.query(sql,insertData, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record inserted");
      //con.destroy();
      console.log("Inserting in mySQL tooks "+(new Date().getTime()-tim));
      mongoSelect();
    });
  });

}


///Mongo part again



function mongoSelect()
{
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";

  console.log("\n\n********************** Mongo findOne **********************\n\n")

  tim = new Date().getTime();
  
  MongoClient.connect(url,{ useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("customers2").findOne({school:3}, function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
      console.log("Mongo search tooks "+(new Date().getTime()-tim));
      sqlSelect();
    });
  });
}


function sqlSelect()
{
  console.log('\n\n**********************mySQL Select***********************\n\n')

  
  tim = new Date().getTime();
  
  //con.connect(function(err) {
    //if (err) throw err;
    console.log("Connected to mySQL!");
    var sql = "SELECT * FROM customers2 WHERE school=3 LIMIT 1;";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result[0]);
      con.destroy();
      console.log("Select in mySQL tooks "+(new Date().getTime()-tim));
    });
  //});

}