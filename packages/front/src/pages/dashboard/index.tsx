import * as React from 'react';
import { Layout } from '../../components/Layout';
import { Seo } from '../../components/seo';
// import { useAuthenticatedUser } from '../../lib/hooks';

export interface DashboardIndexProps {}

export const DashboardIndex: React.FC<DashboardIndexProps> = ({}) => {
    // const { user, isLoading } = useAuthenticatedUser();
    return (
        <Layout>
            <Seo title="Dashboard" />
            <h1>All Boards</h1>
        </Layout>
    );
};
