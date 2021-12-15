import * as React from 'react';
import { Button } from '../components/button';
import { LinkButton } from '../components/linkbutton';
import { useAuthenticatedUser, useLogoutMutation } from '../lib/hooks';

export interface ProfilePageProps {}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
    const { user, isLoading } = useAuthenticatedUser();

    const mutation = useLogoutMutation();

    const handleLogout = () => {
        mutation.mutate();
    };

    return (
        <>
            <h1>Profile Informations :</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {!mutation.isLoading && !mutation.isSuccess && user && (
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
                            <LinkButton href="/">Back to home</LinkButton>
                        </>
                    )}
                    <Button
                        variant={'danger'}
                        onClick={handleLogout}
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? 'Logging out...' : 'Logout'}
                    </Button>
                </>
            )}
        </>
    );
};
