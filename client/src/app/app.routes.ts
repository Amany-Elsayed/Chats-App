import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ChatList } from './components/chat-list/chat-list';
import { authGuard } from './guards/auth-guard';
import { ChatWindow } from './components/chat-window/chat-window';

export const routes: Routes = [
    { path: '', redirectTo: 'chats', pathMatch: 'full' },
    { path: 'login', component: Login},
    { path: 'register', component: Register},
    { path: 'chats', component: ChatList, canActivate: [authGuard], children: [
        { path: ':id', component: ChatWindow}
    ]}
];