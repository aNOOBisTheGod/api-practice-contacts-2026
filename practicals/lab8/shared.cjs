const grpc=require('@grpc/grpc-js');const loader=require('@grpc/proto-loader');
const def=loader.loadSync(require('node:path').join(__dirname,'tasks.proto'),{defaults:true,keepCase:true});
module.exports={grpc,TaskService:grpc.loadPackageDefinition(def).tasks.TaskService};
