var expressKuch = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql");

var path = require("path");
const { report } = require("process");
const port = process.env.PORT || 4000;
var app = expressKuch();
//         port   behavior



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


app.listen(2007, function () {
    console.log("Server Started");
})


//api-url handler
app.get("/hello", function (req, res) {
    res.send("hi bro/sis");
    console.log("**********");
})


app.use(expressKuch.static("public"));  //imp for using ajax....


var dbConfiguration = {
    host: "localhost",
    user: "root",
    password: "",
    database: "projectji"
}

var refDB = mysql.createConnection(dbConfiguration);
refDB.connect(function (errKuch) {

    if (errKuch)
        console.log(errKuch);
    else
        console.log("Connected to Server............");
})


app.get("/", function (req, resp) {


    var puraPath = process.cwd() + "/public/home.html";


    resp.sendFile(puraPath);
});


app.get("/home-page", function (req, resp) {
    var fullPath = path.join(__dirname, "public", "index.html");
    resp.sendFile(fullPath);
})


app.get("/signup", function (req, resp) {

    var dataAry = [req.query.mail, req.query.pass, req.query.utype, 1];
    refDB.query("insert into users values(?,?,?,?)", dataAry, function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send("inserted successfully");

    })
})


app.get("/chklogin", function (req, resp) {
    var ary = [req.query.txtemail, req.query.txtpass];

    refDB.query("select * from users where email=? and pwd=? and status=1", ary, function (err, result) {

        if (err) {
            resp.send(err);
        }
        else {
            resp.send(result);
        }
    })
})




app.get("/chksetting", function (req, resp) {
    var ary = [req.query.temail, req.query.cpass];


    var ary1 = [req.query.npass, req.query.temail];

    refDB.query("select * from users where email=? and pwd=? and status=1", ary, function (err, result) {

        if (err) {
            resp.send(err);
        }
        else if (result.length == 1) {
            refDB.query("update users set pwd=? where email=?", ary1, function (err, result) {
                if (err) {
                    resp.send(err)
                }
                else {
                    resp.send("password successfully updated");
                }


            });

        }
        else

            resp.send("invalid old password");


    })

    //----------------------------------------------------------------
})

app.use(fileuploader());
app.use(expressKuch.urlencoded('extended:true'));
app.post("/profile-process", function (req, resp) {

    var fname1 = req.body.name1 + "-" + req.files.profilePic1.name;
    var des = process.cwd() + "/public/uploads/" + fname1;
    req.files.profilePic1.mv(des, function (err) {
        if (err)
            console.log(err);
        else
            resp.send("Badhaiiiiiiii");
    })
 

    var fname2 = req.body.email + "-" + req.files.profilePic2.name;
    var des = process.cwd() + "/public/uploads/" + fname2
    req.files.profilePic2.mv(des, function (err) {
        if (err)
            console.log(err);
        else
            resp.send("Badhaiiiiiiii");
    })



    var dataAry = [req.body.email, req.body.name1, req.body.Mobile, req.body.txtAddr, req.body.city, req.body.inputId, req.body.Ctime, fname1, fname2];

    refDB.query("insert into dprofile values(?,?,?,?,?,?,?,?,?)", dataAry, function (err, result) {
        if (err)



            resp.send(err);


        else
            resp.send("Inserted Successfully");
    })
})


app.get("/getProfileObject", function (req, resp) {  //doubt....

    refDB.query("select * from dprofile where emailid=?", [req.query.Email], function (err, resultAryOfObjects) {
        if (err) {

            resp.send(err);
        }

        else
            resp.send(resultAryOfObjects);;
    })
})



app.post("/profile-update", function (req, resp) {


    //console.log(req.files.profilePic1.name);

    var fname1;
    

    if (req.files != null) {
        fname1 = req.body.email + "-" + req.files.profilePic1.name;
        var des = process.cwd() + "/public/uploads/" + fname1;
        req.files.profilePic1.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })
    }

    else
    fname1=req.body.hdn1;
  

    var fname2;

    if (req.files != null) {
        fname2 = req.body.email + "-" + req.files.profilePic2.name;
        var des = process.cwd() + "/public/uploads/" + fname2;
        req.files.profilePic2.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Badhaiiiiiiii");
        })
    }


    else
    fname2=req.body.hdn2;
   




var dataAry = [req.body.name1, req.body.Mobile, req.body.txtAddr, req.body.city, req.body.inputId, req.body.Ctime, fname1, fname2,req.body.email];

refDB.query("update dprofile set name=?, mobile=?, address=? , city=?, prooftype=?,timings=?,proofpic=?,profilepic=? where emailid=?", dataAry, function (err, result)
 {
    if (err)
    {
    console.log(err);
        resp.send(err);
    }
    else
        resp.send("Inserted Successfully");
})
})


//==========================================================================================================================================


// app.use(fileuploader());

app.post("/submit-process", function (req, resp) {

    var fname = req.body.emailid + "-" + req.files.pic.name;
    var des = process.cwd() + "/public/uploads/" + fname;
    req.files.pic.mv(des, function (err) {
        if (err)
            console.log(err);
        else
            resp.send("Badhaiiiiiiii");
    })
 

   


    var dataAry = [req.body.emailid, req.body.mname, req.body.pack, req.body.qty, req.body.expdate, req.body.comp,fname,req.body.comment];

    refDB.query("insert into medicines values(?,?,?,?,?,?,?,?,current_date())", dataAry, function (err, result) {
        if (err)



            resp.send(err);


        else
            resp.send("Inserted Successfully");
    })
})



app.get("/profile-delete-angular",function(req,res)
{                                //table col name
    refDB.query("delete from dprofile where emailid=?",[req.query.emailidX],function(err,result){
            if(err)
                res.send(err);
            else
            if(result.affectedRows==0)
            res.send("Invalid Id");
            else
                res.send("Record Deleted Successfulllllyyyyy.... Badhaiiiii");
    })
})








app.all("/fetchdonors",function(req,resp)
{
    refDB.query("select * from dprofile ",function(err,resultAryOfObjects)
    {
         if(err)
             resp.send(err);
            
         else
             resp.send(resultAryOfObjects);;
    })

})


app.get("/block-user",function(req,res){
    refDB.query("update users set status=0 where email=?",[req.query.emailidx],function(err,result){
      if(err)
      res.send(err);
      else
      if(result.affectedRows==0)
      res.send("invalid id");
      else
      res.send("user blocked");
    })
})
app.all("/fetchallrecords",function(req,resp){
    refDB.query("select * from users",function(err,result){
        if(err)
        resp.send(err);
        else
        resp.send(result);
    })
})

app.get("/resume-user",function(req,resp){
    refDB.query("update users set status=1 where email=?",[req.query.emailidx],function(err,result){
        if(err)
        resp.send(err);
        else
        if(result.affectedRows==0)
        resp.send("invalid id");
        else
        resp.send("email id resumed")
    })
})





app.get("/fetchcity",function(req,res){

    refDB.query("select distinct city from dprofile",function(err,resultcity){
        console.log(resultcity);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultcity);
            res.send(resultcity);
        }
    })



})






app.get("/fetchmed",function(req,res){
    refDB.query("select distinct medicine from medicines inner join dprofile on medicines.emailid=dprofile.emailid where dprofile.city=?",[req.query.city],function(err,resultmed){
        console.log(resultmed);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(resultmed);
            res.send(resultmed);
        }
    })
})






app.get("/fetchdonor",function(req,res){

    refDB.query("select * from medicines inner join dprofile on medicines.emailid=dprofile.emailid where dprofile.city=? and medicines.medicine=?",[req.query.city,req.query.med],function(err,result){
        console.log(result);
        if(err)
        {
            res.send(err);
        }
        else
        {
            console.log(result);
            res.send(result);
        }
    })



})

app.get("/detailofdonor",function(req,resp){
    refDB.query("select * from dprofile where emailid=?",[req.query.email],function(err,result){
        
        if(err)
        {
            resp.send(err);
        }
        else
        {
            console.log(result);
            resp.send(result);
        }
    })
})


app.get("/fetchlistedmed",function(req,resp){
    refDB.query("select * from medicines where emailid=?",[req.query.emailid],function(err,result){
        if(err)
        {
            resp.send(err);
        }
        else
        {
            console.log(result);
            resp.send(result);
        }
    })
})


app.get("/unlist-med-angular",function(req,resp){
    refDB.query("delete * from medicines where emailid=?,medicine=?",[req.query.emailidx,req.query.medx],function(err,result){
        if(err)
                resp.send(err);
           
            else
                resp.send("Record Deleted Successfulllllyyyyy.... Badhaiiiii");
    })
})





app.post("/profile-process2", function (req, resp) {

var dataAry = [ req.body.name1, req.body.Mobile, req.body.txtAddr, req.body.city,req.body.email];
    refDB.query("insert into nprofile values(?,?,?,?,?)", dataAry, function (err, result) {
        if (err)



            resp.send(err);


        else
            resp.send("Inserted Successfully");
    })
})













