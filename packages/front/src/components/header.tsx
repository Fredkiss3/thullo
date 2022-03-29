import * as React from 'react';
import { Logo } from './logo';
import cls from '../styles/components/header.module.scss';
import { Icon } from './icon';
import { LinkButton } from './linkbutton';
import { Input } from './input';
import {
    useChangeBoardNameMutation,
    useLogoutMutation,
    useSingleBoardQuery,
    useUserQuery,
} from '@/lib/queries';
import { DropdownItem, DropdownMenu } from './dropdown-menu';
import { Link, useParams } from 'react-router-dom';
import { Button } from './button';
import { useToastContext } from '@/context/toast.context';
import { useOnClickOutside } from '@/lib/hooks';

export interface HeaderProps {
    currentPageTitle?: string;
}

export function Header({ currentPageTitle }: HeaderProps) {
    const { boardId } = useParams<{ boardId: string }>();
    const { dispatch } = useToastContext();
    const { data: board } = useSingleBoardQuery(boardId);
    const { data: user } = useUserQuery();
    const isBoardAdmin = user?.id === board?.admin.id;
    const mutation = useChangeBoardNameMutation();

    const [boardName, setBoardName] = React.useState<string>(
        currentPageTitle ?? ''
    );

    const [isEditing, setIsEditing] = React.useState(false);
    const ref = React.useRef<HTMLInputElement>(null);

    const handleChangeName = React.useCallback(
        (boardName: string) => {
            setIsEditing(false);
            let newName = boardName.trim();

            if (
                board &&
                newName.length > 0 &&
                newName !== board.name &&
                isBoardAdmin
            ) {
                mutation.mutate({
                    boardId: board.id,
                    newName: boardName,
                    oldName: board.name,
                    onSuccess: () => {
                        dispatch({
                            type: 'ADD_SUCCESS',
                            key: `board-set-name-${new Date().getTime()}`,
                            message: 'Board name successfully changed.',
                        });
                    },
                });
            } else if (newName.length === 0) {
                newName = board?.name ?? '';
            }

            setBoardName(newName);
        },
        [board, isBoardAdmin]
    );

    React.useEffect(() => {
        if (ref.current && isEditing) {
            ref.current.focus();
        }
    }, [isEditing]);

    React.useEffect(() => {
        if (board) {
            setBoardName(board.name);
        }
    }, [board]);

    return (
        <header className={cls.header}>
            <div className={cls.header__left}>
                <Link to={'/dashboard'} className={cls.header__left__logo}>
                    <Logo />
                </Link>

                {currentPageTitle && (
                    <>
                        {!isEditing || !isBoardAdmin ? (
                            <h1
                                className={cls.header__left__title}
                                style={{
                                    cursor: 'pointer',
                                }}
                                onClick={() => board && setIsEditing(true)}
                                data-test-id="page-title"
                            >
                                {boardName}
                            </h1>
                        ) : (
                            <Input
                                ref={ref}
                                testId="page-title-input"
                                onBlur={() => handleChangeName(boardName)}
                                className={cls.header__left__title}
                                value={boardName}
                                onChange={(newValue) => setBoardName(newValue)}
                            />
                        )}

                        <div
                            className={cls.header__left__divider}
                            data-test-id="page-header-divider"
                        />

                        <div className={cls.header__left__button}>
                            <LinkButton
                                href={'/dashboard'}
                                variant={'hollow'}
                                renderIcon={(classNames) => (
                                    <Icon
                                        className={classNames}
                                        icon={'grid'}
                                    />
                                )}
                            >
                                All boards
                            </LinkButton>
                        </div>
                    </>
                )}
            </div>

            <div className={cls.header__right}>
                <Input
                    className={cls.header__right__search_input}
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
                error: true,
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

    const ref = React.useRef<HTMLButtonElement>(null);
    const [showDropdown, setShowDropdown] = React.useState(false);

    useOnClickOutside(ref, () => {
        setShowDropdown(false);
    });

    return (
        <Button
            className={cls.header__avatar}
            ref={ref}
            onClick={() => setShowDropdown(true)}
        >
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
            {!isLoading && showDropdown && (
                <DropdownMenu
                    items={items}
                    className={cls.header__avatar__dropdown}
                />
            )}
        </Button>
    );
}
