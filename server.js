const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '/static')));
const mongoose = require('mongoose');
app.use(express.static(__dirname + '/RestfulTasksCrud/dist'));
//This points to our dist folder
//we typically call it public, or at least keept it consistent
mongoose.connect('mongodb://localhost/restful_tasks_crud');

var TaskSchema = new mongoose.Schema({
    title:{type:String, required:[true, 'Title is a required field']},
    description: {type:String, minlength:[5, 'Description must be at least 5 characters']}

}, {timestamps: true})

var Task = mongoose.model('Task', TaskSchema);

app.get('/tasks', (req, res)=> {
    Task.find({}, (err, tasks)=>{
        res.json(tasks)
    })
})

app.post('/tasks', (req, res)=>{
    var task = new Task(req.body);
    task.save((err, savedTask)=>{
        if(err){
            console.log(err);
        }else{
            res.json(savedTask)
        }
    })
})

app.get('/tasks/:id', (req,res)=>{
    Task.findOne({_id: req.params.id}, (err,task)=>{
        if(err){
            console.log(err);
        } else {
            res.json(task)
        }
    })
})

app.put('/tasks/:id', (req,res)=>{
    Task.findByIdAndUpdate(req.params.id, req.body, (err,confirmation)=>{
        if(err){
            console.log(err);
        } else {
            res.json({success:"Successfully updated"})
        }
    })
})

app.delete('/tasks/:id', (req,res)=>{
    Task.remove({_id:req.params.id}, (err)=>{
        if(err){
            console.log(err)
        }else{
            res.json({success: "Deleted a task"})
        }
    })
})

app.listen(6800, () => {
    console.log("We're on 6800")
})