import * as React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import cls from '@/styles/pages/dashboard/layout.module.scss';

export interface LayoutProps {
    className?: string;
    hideHeader?: boolean;
    hideFooter?: boolean;
    children?: React.ReactNode;
    currentPageTitle?: string;
    unConstrained?: boolean;
    containerClassName?: string;
}

export function Layout({
    children,
    className,
    containerClassName,
    currentPageTitle,
    hideFooter = false,
    hideHeader = false,
    unConstrained = false,
}: LayoutProps) {
    return (
        <>
            {!hideHeader && <Header currentPageTitle={currentPageTitle} />}
            <main className={className}>
                <div
                    className={`${cls.container} ${
                        !unConstrained && cls[`container--constrained`]
                    } ${containerClassName ?? ''}`}
                >
                    {children}
                </div>
            </main>
            {!hideFooter && <Footer />}
        </>
    );
}
