
var Task        = require('../models/task.js')


class TasksController {
    index(request, response){
        Task.find({}, function(error, tasks) {
            if(error){
                return response.json(error);
            }
            return response.json(tasks);
        });
    }
    create(request, response){
        Task.create(request.body, (error, tasks) => {
            if(error){
                return response.json(error);
            }
            return response.json(tasks);
        });
    }
    show(request, response){
        Task.findOne(request.params.id, (error,task) => {
            if(error){
                return response.json({error: "Task not found !"});
            }
            return response.json(task);
        });
    }
    update(request, response){
        Task.findByIdAndUpdate(request.params.id, {$set: request.body}, {new: true}, (error, task) =>{
            if(error){
                return response.json(error);
            }
            return response.json(task);
        });
    }
    destroy(request, response){
        Task.findOneAndRemove(request.params.id, function(error,task){
            if(error){
                return response.json(error);
            }
            return response.json({"Success": "Deleted task"});
            // return response.json(task);
        });
    }
}

module.exports = new TasksController();

//get all tasks method: index, route: /tasks, type: get
//create a task method: create, routes: /tasks, type: post
//get a single task from the db method: show, route: /tasks/id, type: get
//update task by id method: update, route: /tasks/:id , type: put/patch
//delete task by id, method: destroy, route: /tasks/:id, type: delete


