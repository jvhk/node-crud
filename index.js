const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


let mysqlConn = mysql.createConnection({
    hots: 'localhost',
    user: 'root',
    password : 'root',
    database : 'employeedb',
    multipleStatements: true
});

mysqlConn.connect((err) => {
    if(!err){
        console.log('DB connection succeded')
    }else{
        console.log('DB connection failed \n Error:' + JSON.stringify(err, undefined));
    }
});



app.listen(3000, ()=>{
    console.log('Express server is running at port number 3000');
})

//Get all employees
app.get('/employees',(req, res)=>{
    mysqlConn.query('SELECT * FROM employee', (err, rows, fields) =>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});

//Get an employees
app.get('/employees/:id',(req, res)=>{
    mysqlConn.query('SELECT * FROM employee WHERE EmpID=?',[req.params.id], (err, rows, fields) =>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});


//Delete an employees
app.delete('/employees/:id',(req, res)=>{
    mysqlConn.query('DELETE FROM employee WHERE EmpID=?',[req.params.id], (err, rows, fields) =>{
        if(!err){
            res.send('Emplyoee deleted sucessfully');
        }else{
            console.log(err);
        }
    })
});


//Insert an employees
app.post('/employees/',(req, res)=>{
    let emp = req.body;
    let sql = "set @EmpID = ?; SET @Name = ?; SET @EmpCode = ?;SET @Salary = ?; CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";
    mysqlConn.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if(!err){
            rows.forEach(element => {
                if(element.constructor == Array){
                    res.send('Inserted employeed id: ' + element[0].EmpID);
                }
            });
        }else{
            console.log(err);
        }
    }) 
});


//Insert an employees
app.put('/employees',(req, res)=>{
    let emp = req.body;
    let sql = "set @EmpID = ?; SET @Name = ?; SET @EmpCode = ?;SET @Salary = ?; CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";
    mysqlConn.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields) => {
        if(!err){
            res.send('Update sucessfully');
        }else{
            console.log(err);
        }
    }) 
});