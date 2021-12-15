import * as React from 'react';
import { Alert } from '../components/alert';
import { Icon } from '../components/icon';
import { LinkButton } from '../components/linkbutton';
import { Seo } from '../components/seo';
import { getHostWithScheme, parseQueryStringFromURL } from '../lib/functions';
import { ApiErrors } from '../lib/types';

export interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = (props) => {
    const query = parseQueryStringFromURL(window.location.href);
    let errors: ApiErrors = null;
    if (query.errors) {
        try {
            errors = JSON.parse(decodeURIComponent(query.errors));
        } catch (e) {
            // Do nothing
        }
    }

    function getAuthURL(provider: string): URLSearchParams {
        const params = new URLSearchParams();
        params.append('response_type', 'code');
        params.append('client_id', '6Oca5cWftabV050Or7ZfESJ4LIR5kICw');
        params.append(
            'redirect_uri',
            `${getHostWithScheme(window.location.href)}/callback`
        );
        params.append('connection', provider);
        params.append('scope', 'openid profile email');

        return params;
    }

    return (
        <>
            <Seo title="Login" />

            <h1>Connexion</h1>

            {errors && (
                <Alert type={'danger'}>
                    <div>
                        {Object.keys(errors).map((key) => (
                            <span key={key}>{errors![key]}</span>
                        ))}
                    </div>
                </Alert>
            )}
            <LinkButton
                external
                variant={'primary'}
                href={`https://dev-7tket-qt.us.auth0.com/authorize?${getAuthURL(
                    'google-oauth2'
                ).toString()}`}
                renderIcon={(classNames) => (
                    <Icon className={classNames} icon={'google'} />
                )}
            >
                Continuer avec Google
            </LinkButton>
            <LinkButton
                variant={'black'}
                external
                href={`https://dev-7tket-qt.us.auth0.com/authorize?${getAuthURL(
                    'github'
                ).toString()}`}
                renderIcon={(classNames) => (
                    <Icon className={classNames} icon={'github'} />
                )}
            >
                Continuer avec Github
            </LinkButton>
        </>
    );
};
