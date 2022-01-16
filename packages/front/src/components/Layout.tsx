import * as React from 'react';
import { Header } from './header';
import { Footer } from './footer';

export interface LayoutProps {
    className?: string;
    hideHeader?: boolean;
    hideFooter?: boolean;
    currentPageTitle?: string;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    className,
    currentPageTitle,
    hideFooter = false,
    hideHeader = false,
}) => {
    return (
        <>
            {!hideHeader && <Header currentPageTitle={currentPageTitle} />}
            <main className={className}>{children}</main>
            {!hideFooter && <Footer />}
        </>
    );
};
