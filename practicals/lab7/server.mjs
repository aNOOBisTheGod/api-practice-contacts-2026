import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {GraphQLError} from 'graphql';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
const authors=[{id:'1',name:'Михаил Булгаков'},{id:'2',name:'Аркадий и Борис Стругацкие'}];
let books=[{id:'1',name:'Мастер и Маргарита',genre:'Роман',authorId:'1'},{id:'2',name:'Пикник на обочине',genre:'Фантастика',authorId:'2'}];
function validate(input){if(!input.name.trim()||!input.genre.trim()||!authors.some(a=>a.id===input.authorId))throw new GraphQLError('Проверьте название, жанр и автора',{extensions:{code:'BAD_USER_INPUT'}});}
const resolvers={Query:{books:()=>books,book:(_,a)=>books.find(b=>b.id===a.id),authors:()=>authors},Book:{author:b=>authors.find(a=>a.id===b.authorId)},Author:{books:a=>books.filter(b=>b.authorId===a.id)},Mutation:{addBook:(_,a)=>{validate(a.input);const b={id:randomUUID(),...a.input};books.push(b);return b;},updateBook:(_,a)=>{validate(a.input);const b=books.find(b=>b.id===a.id);if(!b)throw new GraphQLError('Книга не найдена');Object.assign(b,a.input);return b;},deleteBook:(_,a)=>{const n=books.length;books=books.filter(b=>b.id!==a.id);return books.length<n;}}};
const server=new ApolloServer({typeDefs:readFileSync(new URL('schema.graphql',import.meta.url),'utf8'),resolvers});
const {url}=await startStandaloneServer(server,{listen:{host:'127.0.0.1',port:3107}});console.log(url);
