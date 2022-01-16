import * as React from 'react';
import { Outlet, Link } from "react-router-dom";

export interface DashboardLayoutProps {}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({}) => {
    return (
        <>
            <Outlet />
        </>
    );
};
