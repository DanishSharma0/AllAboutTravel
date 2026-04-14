import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AIChatBot from './AIChatBot';
import { Outlet, useLocation } from 'react-router-dom';

const AUTH_ROUTES = ['/login', '/register'];

const Layout = () => {
    const location = useLocation();
    const isAuthPage = AUTH_ROUTES.includes(location.pathname);

    if (isAuthPage) {
        // Auth pages get NO header, NO footer, NO padding — full-screen only
        return (
            <>
                <Outlet />
                <AIChatBot />
            </>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-sand-50 text-slate-800">
            <Header />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <AIChatBot />
            <Footer />
        </div>
    );
};

export default Layout;
