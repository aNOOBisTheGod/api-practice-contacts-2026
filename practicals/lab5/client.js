import 'zone.js';
import '@angular/compiler';
import {Component,provideZoneChangeDetection,inject,ChangeDetectorRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {bootstrapApplication} from '@angular/platform-browser';
class ContactsApp {
 cdr=inject(ChangeDetectorRef); contacts=[]; name=''; phone=''; email=''; editing=null; message='';
 constructor(){this.load();}
 async load(){this.contacts=await (await fetch('/api/contacts')).json();this.cdr.markForCheck();}
 edit(c){this.editing=c._id;this.name=c.name;this.phone=c.phone;this.email=c.email;}
 clear(){this.editing=null;this.name='';this.phone='';this.email='';}
 async save(){const r=await fetch('/api/contacts'+(this.editing?'/'+this.editing:''),{method:this.editing?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:this.name,phone:this.phone,email:this.email})});if(!r.ok){this.message=(await r.json()).error;this.cdr.markForCheck();return;}this.message=this.editing?'Контакт изменён':'Контакт создан';this.clear();await this.load();}
 async remove(c){const r=await fetch('/api/contacts/'+c._id,{method:'DELETE'});this.message='DELETE: HTTP '+r.status;await this.load();}
}
Component({selector:'contacts-app',standalone:true,imports:[CommonModule,FormsModule],template:`<h1>Телефонные контакты</h1><p>Практическая № 5 · Angular + Express + MongoDB</p><form (ngSubmit)="save()"><label>Имя<input name="name" [(ngModel)]="name" required></label><label>Телефон<input name="phone" [(ngModel)]="phone" required></label><label>Email<input name="email" [(ngModel)]="email"></label><button type="submit">{{ editing ? 'Сохранить изменения' : 'Добавить контакт' }}</button><button type="button" (click)="clear()">Очистить</button></form><p role="status">{{message}}</p><table><thead><tr><th>Имя</th><th>Телефон</th><th>Email</th><th>Действия</th></tr></thead><tbody><tr *ngFor="let c of contacts"><td>{{c.name}}</td><td>{{c.phone}}</td><td>{{c.email}}</td><td><button (click)="edit(c)">Изменить</button><button (click)="remove(c)">Удалить</button></td></tr></tbody></table><p>{{contacts.length}} контакт(ов). Данные сохраняются в MongoDB.</p>`})(ContactsApp);
bootstrapApplication(ContactsApp,{providers:[provideZoneChangeDetection() ]}).catch(console.error);
