const express = require('express');
const {MongoClient,ObjectId}=require('mongodb');
const path=require('node:path');
const app=express(); app.use(express.json());
const dbClient=new MongoClient(process.env.MONGODB_URI||'mongodb://127.0.0.1:27028');
let contacts;
const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
function data(body){return {name:String(body.name||'').trim(),phone:String(body.phone||'').trim(),email:String(body.email||'').trim()};}
function valid(d){return d.name.length>0 && /^\+?[0-9 ()-]{5,25}$/.test(d.phone);}
app.param('id',(req,res,next,id)=>{if(!ObjectId.isValid(id))return res.status(400).json({error:'Некорректный ID'});req.contactId=new ObjectId(id);next();});
app.get('/api/contacts',wrap(async(req,res)=>res.json(await contacts.find({}).sort({name:1}).toArray())));
app.get('/api/contacts/:id',wrap(async(req,res)=>{const d=await contacts.findOne({_id:req.contactId});d?res.json(d):res.status(404).json({error:'Контакт не найден'});}));
app.post('/api/contacts',wrap(async(req,res)=>{const d=data(req.body);if(!valid(d))return res.status(400).json({error:'Укажите имя и корректный телефон'});const r=await contacts.insertOne(d);res.status(201).location('/api/contacts/'+r.insertedId).json({...d,_id:r.insertedId});}));
app.put('/api/contacts/:id',wrap(async(req,res)=>{const d=data(req.body);if(!valid(d))return res.status(400).json({error:'Укажите имя и корректный телефон'});const r=await contacts.findOneAndUpdate({_id:req.contactId},{$set:d},{returnDocument:'after'});r?res.json(r):res.status(404).json({error:'Контакт не найден'});}));
app.delete('/api/contacts/:id',wrap(async(req,res)=>{const r=await contacts.deleteOne({_id:req.contactId});r.deletedCount?res.status(204).end():res.status(404).json({error:'Контакт не найден'});}));
app.use(express.static(path.join(__dirname,'public')));
app.use((err,req,res,next)=>{console.error(err.message);res.status(500).json({error:'Ошибка сервера'});});
(async()=>{await dbClient.connect();contacts=dbClient.db('api_practice_contacts').collection('contacts');app.listen(process.env.PORT||3105,process.env.HOST||'127.0.0.1',()=>console.log('Contacts API listening on '+(process.env.PORT||3105)));})().catch(e=>{console.error(e);process.exit(1);});
