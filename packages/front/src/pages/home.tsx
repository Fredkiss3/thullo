import * as React from 'react';
import { useAuthenticatedUser } from '../lib/hooks';
import { Loader } from '../components/loader';
import { Layout } from '../components/Layout';
import { Seo } from '../components/seo';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = () => {
    const { user, isLoading } = useAuthenticatedUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                navigate('/dashboard');
            }
        }
    }, [user, isLoading]);

    return isLoading ? (
        <Loader />
    ) : (
        <Layout>
            <Seo />
        </Layout>
    );
};
