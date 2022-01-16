import * as React from 'react';
import { Alert } from '../components/alert';
import { Icon } from '../components/icon';
import { LinkButton } from '../components/linkbutton';
import { Seo } from '../components/seo';
import { getHostWithScheme } from '../lib/functions';
import { useErrorsContext } from '../context/ErrorContext';
import { Layout } from '../components/Layout';
import cls from '../styles/pages/login.module.scss';
import { Logo } from '../components/logo';

export interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = (props) => {
    const { errors, dispatch } = useErrorsContext();

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
        <Layout className={cls.main_login} hideHeader hideFooter>
            <Seo title="Login" />

            <div className={cls.login_pane}>
                <div className={cls.login_pane__header}>
                    <div className={cls.login_pane__header__logo}>
                        <Logo />
                    </div>

                    <h1>
                        Take your next project to the moon 🚀 !
                    </h1>

                    <p>
                        Thullo helps you collaborate and manage projects with your team in one
                        place.
                    </p>

                    {errors && (
                        <Alert
                            type={'danger'}
                            onClose={() => dispatch({ type: 'CLEAR_ERRORS' })}
                        >
                            <div>
                                {Object.keys(errors).map((key) => (
                                    <span key={key}>{errors![key]}</span>
                                ))}
                            </div>
                        </Alert>
                    )}
                </div>

                <div className={cls.login_pane__body}>
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
                        Continue with Google
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
                        Continue with Github
                    </LinkButton>
                </div>

                <small className={cls.login_pane__footer}>
                    Created by{' '}
                    <a
                        className={cls.login_pane__footer__username}
                        target={'_blank'}
                        href={'https://github.com/Fredkiss3'}
                    >
                        fredkiss
                    </a>
                </small>
            </div>
        </Layout>
    );
};
