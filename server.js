console.log("Helo server");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
 
var manyData = [{ name: "Company Inc", address: "Highway 37" ,phone:"09434832"}];
manyData=[];
var total = 1000 ;
for(var i = 0 ; i<1000 ; i++)
{
    manyData.push({name:randomName(),adress:randomName()+' '+randomName()+' '+randomName(),phone:Math.floor(Math.random()*10000000000),school:Math.floor(i/(total/4))+1,class:Math.floor(i/(total/40))+1})
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

var tim = new Date().getTime();

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

    console.log('* Insert tooks : '+(new Date().getTime()-tim)+"\n\n");
  });
});