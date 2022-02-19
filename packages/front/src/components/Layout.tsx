import * as React from 'react';
import { Header } from './header';
import { Footer } from './footer';

export interface LayoutProps {
    className?: string;
    hideHeader?: boolean;
    hideFooter?: boolean;
    currentPageTitle?: string;
}

export function Layout({
    children,
    className,
    currentPageTitle,
    hideFooter = false,
    hideHeader = false,
}: LayoutProps) {
    return (
        <>
            {!hideHeader && <Header currentPageTitle={currentPageTitle} />}
            <main className={className}>{children}</main>
            {!hideFooter && <Footer />}
        </>
    );
}
