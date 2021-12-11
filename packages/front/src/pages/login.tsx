import * as React from 'react';

export interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = () => {
    const authenticateWithAuth0 = () => {
        fetch(`https://dev-7tket-qt.us.auth0.com/authorize?
        response_type=code&
        client_id=6Oca5cWftabV050Or7ZfESJ4LIR5kICw&
        connection=google-oauth2&
        redirect_uri=https://localhost:3000/callback`);
    };
    return (
        <>
            <button>Login With Google</button>
        </>
    );
};
