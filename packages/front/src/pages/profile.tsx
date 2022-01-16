import * as React from 'react';
import { useAuthenticatedUser } from '../lib/hooks';
import { Layout } from '../components/Layout';
import { Seo } from '../components/seo';

export interface ProfilePageProps {}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
    const { user, isLoading } = useAuthenticatedUser();

    return (
        <Layout currentPageTitle={'Profile'}>
            <Seo title="Profile" />

            <h1>Profile Informations :</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                user && (
                    <>
                        <div>
                            <img src={user.avatarURL} alt={user.name} />
                        </div>
                        <div>
                            <p>
                                <strong>Name:</strong> {user.name}
                            </p>
                            <p>
                                <strong>Login:</strong> {user.login}
                            </p>
                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>
                        </div>
                    </>
                )
            )}
        </Layout>
    );
};
