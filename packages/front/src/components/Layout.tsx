import * as React from 'react';

export interface LayoutProps {
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
    return (
        <>
            <main className={className}>{children}</main>
        </>
    );
};
