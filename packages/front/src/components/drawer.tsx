import * as React from 'react';

// styles
import cls from '@/styles/components/drawer.module.scss';
import { Button } from './button';
import { Icon } from './icon';
import { Avatar } from './avatar';
import { useParams } from 'react-router-dom';
import {
    useChangeBoardDescriptionMutation,
    useRemoveMemberMutation,
    useSingleBoardQuery,
    useUserQuery,
} from '@/lib/queries';
import { BoardMember } from '@/lib/types';
import { useToastContext } from '@/context/toast.context';
import { TextArea } from './textarea';
import { clsx, renderMarkdown } from '@/lib/functions';

export interface DrawerMenuProps {
    open: boolean;
    onClose: () => void;
}

export function Drawer({ open, onClose }: DrawerMenuProps) {
    const { boardId } = useParams<{ boardId: string }>();
    const { data: board, isLoading } = useSingleBoardQuery(boardId);
    const { data: user } = useUserQuery();
    const { dispatch } = useToastContext();
    const removeMemberMutation = useRemoveMemberMutation();
    const removeMember = React.useCallback((member: BoardMember) => {
        removeMemberMutation.mutate({
            boardId: boardId!,
            member,
            onSuccess: () => {
                dispatch({
                    type: 'ADD_SUCCESS',
                    key: `board-remove-${new Date().getTime()}`,
                    message: 'Member successfully removed from the board.',
                });
            },
        });
    }, []);

    const setDescriptionMutation = useChangeBoardDescriptionMutation();
    const changeDescription = React.useCallback(
        (description: string | null) => {
            setIsEditingDescription(false);
            let newDescription = (description ?? '').trim();

            setDescriptionMutation.mutate({
                boardId: boardId!,
                newDescription,
                oldDescription: board!.description,
                onSuccess: () => {
                    dispatch({
                        type: 'ADD_SUCCESS',
                        key: `board-description-${new Date().getTime()}`,
                        message: 'Board description successfully changed.',
                    });
                },
            });
        },
        []
    );

    const [description, setDescriptionState] = React.useState(
        board?.description ?? ''
    );

    const [isEditingDescription, setIsEditingDescription] =
        React.useState(false);

    if (!board || isLoading || !boardId) {
        return <></>;
    }

    const isBoardAdmin = user?.id === board?.admin.id;

    return (
        <>
            {/* Menu */}
            <nav
                className={clsx(cls.drawer, {
                    [cls['drawer--open']]: open,
                    [cls['drawer--closed']]: !open,
                })}
            >
                <header className={cls.drawer__header}>
                    <h2 className={cls.drawer__header__title}>Menu</h2>
                    <Button
                        square
                        onClick={onClose}
                        renderTrailingIcon={(cls) => (
                            <Icon icon="x-icon" className={cls} />
                        )}
                    />
                </header>
                <section className={cls.drawer__section}>
                    <div className={cls.drawer__section__header}>
                        <Icon
                            icon="user"
                            className={cls.drawer__section__header__icon}
                        />
                        <small>Made by</small>
                    </div>

                    <div className={cls.drawer__section__author}>
                        <Avatar
                            photoURL={board.admin.avatarURL}
                            name={board.admin.name}
                            username={board.admin.login}
                        />

                        <div className={cls.drawer__section__author__name}>
                            <span>{board.admin.name}</span>
                            <span>@{board.admin.login}</span>
                        </div>
                    </div>
                </section>

                <section className={cls.drawer__section}>
                    <div className={cls.drawer__section__header}>
                        <Icon
                            icon="document"
                            className={cls.drawer__section__header__icon}
                        />
                        <small>Description</small>

                        {isBoardAdmin && (
                            <Button
                                variant="outline"
                                size="small"
                                className={
                                    cls.drawer__section__header__edit_btn
                                }
                                onClick={() => setIsEditingDescription(true)}
                                renderLeadingIcon={(clsx) => {
                                    return (
                                        <Icon icon="pencil" className={clsx} />
                                    );
                                }}
                            >
                                Edit
                            </Button>
                        )}
                    </div>

                    <div className={cls.drawer__section__description}>
                        {isEditingDescription ? (
                            <form
                                className={
                                    cls.drawer__section__description__form
                                }
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    changeDescription(description);
                                }}
                            >
                                <TextArea
                                    className={
                                        cls.drawer__section__description__form__textarea
                                    }
                                    value={description ?? ''}
                                    rows={20}
                                    placeholder="Add a description (markdown supported)"
                                    onChange={setDescriptionState}
                                />

                                <div
                                    className={
                                        cls.drawer__section__description__form__actions
                                    }
                                >
                                    <Button
                                        variant="success"
                                        type="submit"
                                        className={
                                            cls.drawer__section__description__form__actions__btn
                                        }
                                    >
                                        Save
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setIsEditingDescription(false);
                                            setDescriptionState(
                                                board.description ?? ''
                                            );
                                        }}
                                        className={
                                            cls.drawer__section__description__form__actions__btn
                                        }
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : board.description ? (
                            <article
                                className={
                                    cls.drawer__section__description__text
                                }
                                dangerouslySetInnerHTML={{
                                    __html: renderMarkdown(board.description),
                                }}
                            />
                        ) : (
                            <p
                                className={
                                    cls.drawer__section__description__empty
                                }
                            >
                                No description
                            </p>
                        )}
                    </div>
                </section>

                <section className={cls.drawer__section}>
                    <div className={cls.drawer__section__header}>
                        <Icon
                            icon="document"
                            className={cls.drawer__section__header__icon}
                        />
                        <small>Team</small>
                    </div>

                    <ul className={cls.drawer__section__team}>
                        <li className={cls.drawer__section__team__member}>
                            <Avatar
                                photoURL={board.admin.avatarURL}
                                name={board.admin.name}
                                username={board.admin.login}
                            />

                            <span
                                className={
                                    cls.drawer__section__team__member__name
                                }
                            >
                                {board.admin.name}
                            </span>

                            <small
                                className={
                                    cls.drawer__section__team__member__admin_text
                                }
                            >
                                Admin
                            </small>
                        </li>

                        {board.participants.map((member) => (
                            <li
                                className={cls.drawer__section__team__member}
                                key={member.id}
                            >
                                <Avatar
                                    photoURL={member.avatarURL}
                                    name={member.name}
                                    username={member.login}
                                />

                                <span
                                    className={
                                        cls.drawer__section__team__member__name
                                    }
                                >
                                    {member.name}
                                </span>

                                {isBoardAdmin && (
                                    <Button
                                        variant="danger"
                                        size="small"
                                        className={
                                            cls.drawer__section__team__member__remove_btn
                                        }
                                        onClick={() => removeMember(member)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </nav>
        </>
    );
}
