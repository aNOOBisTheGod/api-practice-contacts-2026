const {grpc,TaskService}=require('./shared.cjs');const {randomUUID}=require('node:crypto');
const tasks=new Map(); const server=new grpc.Server();
const missing=cb=>cb({code:grpc.status.NOT_FOUND,details:'Задача не найдена'});
const invalid=cb=>cb({code:grpc.status.INVALID_ARGUMENT,details:'Название обязательно'});
server.addService(TaskService.service,{
 CreateTask(call,cb){if(!call.request.title.trim())return invalid(cb);const t={id:randomUUID(),title:call.request.title,completed:call.request.completed};tasks.set(t.id,t);cb(null,t);},
 ListTasks(call,cb){cb(null,{tasks:[...tasks.values()]});},
 GetTask(call,cb){const t=tasks.get(call.request.id);t?cb(null,t):missing(cb);},
 UpdateTask(call,cb){const t=call.request;if(!tasks.has(t.id))return missing(cb);if(!t.title.trim())return invalid(cb);tasks.set(t.id,t);cb(null,t);},
 DeleteTask(call,cb){tasks.delete(call.request.id)?cb(null,{}):missing(cb);}
});
server.bindAsync('127.0.0.1:50058',grpc.ServerCredentials.createInsecure(),(e,p)=>{if(e)throw e;console.log('TaskService gRPC on 127.0.0.1:'+p);});
