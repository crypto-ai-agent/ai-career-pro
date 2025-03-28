import { lazy } from 'react';

// Public routes
export const Home = lazy(() => import('../pages/Home').then(module => ({ default: module.Home })));
export const About = lazy(() => import('../pages/About').then(module => ({ default: module.About })));
export const Services = lazy(() => import('../pages/Services').then(module => ({ default: module.Services })));
export const Pricing = lazy(() => import('../pages/Pricing').then(module => ({ default: module.Pricing })));
export const Contact = lazy(() => import('../pages/Contact').then(module => ({ default: module.Contact })));

// Auth routes
export const Login = lazy(() => import('../pages/auth/Login').then(module => ({ default: module.Login })));
export const Signup = lazy(() => import('../pages/auth/Signup').then(module => ({ default: module.Signup })));
export const ResetPassword = lazy(() => import('../pages/auth/ResetPassword').then(module => ({ default: module.ResetPassword })));

// Protected routes
export const Dashboard = lazy(() => import('../pages/Dashboard').then(module => ({ default: module.Dashboard })));
export const Settings = lazy(() => import('../pages/Settings').then(module => ({ default: module.Settings })));
export const History = lazy(() => import('../pages/History').then(module => ({ default: module.History })));