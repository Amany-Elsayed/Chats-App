import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { ChatList } from './components/chat-list/chat-list';
import { authGuardGuard } from './guards/auth.guard-guard';
import { ChatWindow } from './components/chat-window/chat-window';

export const routes: Routes = [
    { path: '', redirectTo: 'chats', pathMatch: 'full' },
    { path: 'login', component: Login},
    { path: 'register', component: Register},
    { path: 'chats', component: ChatList, canActivate: [authGuardGuard], children: [
        { path: ':id', component: ChatWindow}
    ]}
];
