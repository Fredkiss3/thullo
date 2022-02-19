import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import cls from '../../styles/pages/dashboard/layout.module.scss';
import { useAuthenticatedUser } from '../../lib/queries';
import { Loader } from '../../components/loader';

export interface DashboardLayoutProps {}

export function DashboardLayout({}: DashboardLayoutProps) {
    const { isLoading } = useAuthenticatedUser();

    // const { boardId } = useParams<{ boardId?: string }>();
    // if (!boardId) {
    //     // TODO : load board to get the name and pass it to the layour
    // }
    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <Layout className={cls.main}>
                        <Outlet />
                    </Layout>
                </>
            )}
        </>
    );
}
