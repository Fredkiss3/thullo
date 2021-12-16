import * as React from 'react';
import { LinkButton } from '../components/linkbutton';
import { Seo } from '../components/seo';
import { useUserQuery } from '../lib/hooks';

export interface HomePageProps {}

export const HomePage: React.FC<HomePageProps> = () => {
    const { data: user, isLoading } = useUserQuery();

    return (
        <>
            <Seo />
            <h1>Thullo</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {user ? (
                        <LinkButton variant={'primary'} href={'/profile'}>
                            Profil
                        </LinkButton>
                    ) : (
                        <LinkButton variant={'outline'} href={'/login'}>
                            Connexion
                        </LinkButton>
                    )}
                </>
            )}
        </>
    );
};
