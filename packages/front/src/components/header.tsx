import * as React from 'react';
import { Logo } from './logo';
import cls from '../styles/components/header.module.scss';
import { Icon } from './icon';
import { LinkButton } from './linkbutton';
import { Input } from './input';
import { useAuthenticatedUser, useLogoutMutation } from '../lib/hooks';
import { DropdownMenu } from './dropdown-menu';
import { Link } from 'react-router-dom';
import { Button } from './button';

export interface HeaderProps {
    currentPageTitle?: string;
}

export function Header({ currentPageTitle }: HeaderProps) {
    return (
        <header className={cls.header}>
            <div className={cls.header__left}>
                <Link to={'/dashboard'} className={cls.header__left__logo}>
                    <Logo />
                </Link>

                {currentPageTitle && (
                    <>
                        <h1 className={cls.header__left__title}>
                            {currentPageTitle}
                        </h1>

                        <div className={cls.header__left__divider} />

                        <LinkButton
                            href={'/dashboard'}
                            variant={'hollow'}
                            renderIcon={(classNames) => (
                                <Icon className={classNames} icon={'grid'} />
                            )}
                        >
                            All boards
                        </LinkButton>
                    </>
                )}
            </div>

            <div className={cls.header__right}>
                <Input
                    className={cls.header__search_input}
                    placeholder={'Keyword...'}
                    trailingElement={
                        <Button variant={`primary`} isStatic>
                            Search
                        </Button>
                    }
                />
                <HeaderAvatar />
            </div>
        </header>
    );
}

function HeaderAvatar() {
    const { user, isLoading } = useAuthenticatedUser();
    const mutation = useLogoutMutation();

    return (
        <div className={cls.header__avatar}>
            <img
                src={user?.avatarURL}
                alt={user?.name}
                className={cls.header__avatar__image}
            />
            <span className={cls.header__avatar__name}>{user?.name}</span>
            <Icon className={cls.header__avatar__icon} icon={'chevron-down'} />
            {!isLoading && (
                <DropdownMenu
                    items={[
                        {
                            label: 'My Profile',
                            link: '/profile',
                            icon: 'user',
                        },
                        { divider: true },
                        {
                            label: 'Logout',
                            icon: 'logout',
                            onClick: () => {
                                mutation.mutate();
                            },
                            danger: true,
                        },
                    ]}
                    className={cls.header__avatar__dropdown}
                />
            )}
        </div>
    );
}
