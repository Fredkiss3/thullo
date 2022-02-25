import * as React from 'react';
import { Layout } from '../../components/Layout';
import cls from '../../styles/pages/dashboard/layout.module.scss';

export interface DashboardLayoutProps {
    children: React.ReactNode;
    headerTitle?: string;
    className?: string;
}

export function DashboardLayout({
    children,
    headerTitle,
    className,
}: DashboardLayoutProps) {
    return (
        <Layout
            className={className ?? cls.main}
            currentPageTitle={headerTitle}
        >
            {children}
        </Layout>
    );
}
