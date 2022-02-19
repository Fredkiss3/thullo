import * as React from 'react';
import { Logo } from './logo';
import cls from '../styles/components/header.module.scss';
import { Icon } from './icon';
import { LinkButton } from './linkbutton';
import { Input } from './input';
import {
    useAuthenticatedUser,
    useLogoutMutation,
    useUserQuery,
} from '../lib/queries';
import { DropdownItem, DropdownMenu } from './dropdown-menu';
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
    const { data: user, isLoading } = useUserQuery();
    const mutation = useLogoutMutation();

    let items: DropdownItem[];

    if (!isLoading && user) {
        items = [
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
        ];
    } else {
        items = [
            {
                label: 'Login',
                link: '/login',
                icon: 'login',
            },
        ];
    }

    return (
        <div className={cls.header__avatar}>
            {user ? (
                <img
                    src={user.avatarURL}
                    alt={user.name}
                    className={cls.header__avatar__image}
                />
            ) : (
                <div className={cls.header__avatar__placeholder}>G</div>
            )}
            <span className={cls.header__avatar__name}>
                {user ? user.name : 'Guest'}
            </span>
            <Icon className={cls.header__avatar__icon} icon={'chevron-down'} />
            {!isLoading && (
                <DropdownMenu
                    items={items}
                    className={cls.header__avatar__dropdown}
                />
            )}
        </div>
    );
}
