import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import cls from '../../styles/pages/dashboard/layout.module.scss';
import { useUserQuery } from '../../lib/queries';
import { Loader } from '../../components/loader';

export interface DashboardLayoutProps {}

export function DashboardLayout({}: DashboardLayoutProps) {
    const { isLoading, status } = useUserQuery();

    // const { boardId } = useParams<{ boardId?: string }>();
    // if (!boardId) {
    //     // TODO : load board to get the name and pass it to the layout
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
