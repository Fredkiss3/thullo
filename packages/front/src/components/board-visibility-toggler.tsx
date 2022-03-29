import * as React from 'react';
import { Dropdown } from './dropdown';
import cls from '@/styles/components/board-visibility-toggler.module.scss';
import { Button } from './button';
import { Icon } from './icon';
import { useSetBoardVisibilityMutation } from '@/lib/queries';
import { useToastContext } from '@/context/toast.context';
import { clsx } from '@/lib/functions';

export interface BoardVisilityDropdownProps {
    show?: boolean;
    boardId: string;
    isBoardPrivate: boolean;
}

export function BoardVisilityDropdown({
    boardId,
    show = false,
    isBoardPrivate,
}: BoardVisilityDropdownProps) {
    const mutation = useSetBoardVisibilityMutation();
    const { dispatch } = useToastContext();

    const setBoardVisibility = React.useCallback(
        (isPrivate: boolean) => {
            if (isPrivate === isBoardPrivate) {
                // Do nothing if the board is already private or public
                return;
            }

            mutation.mutate({
                isPrivate,
                boardId,
                onSuccess: () => {
                    dispatch({
                        type: 'ADD_SUCCESS',
                        key: `board-visibility-${new Date().getTime()}`,
                        message: 'Board visibility changed successfully',
                    });
                },
            });
        },
        [boardId, mutation, dispatch]
    );

    return (
        <Dropdown
            align="right"
            className={clsx(cls.board_visibility_toggler, {
                [cls['board_visibility_toggler--open']]: show,
            })}
        >
            <div className={cls.board_visibility_toggler__header}>
                <strong className={cls.board_visibility_toggler__header__title}>
                    Visibility
                </strong>
                <p
                    className={
                        cls.board_visibility_toggler__header__description
                    }
                >
                    Choose who can see this board.
                </p>
            </div>

            <div className={cls.board_visibility_toggler__body}>
                <Button
                    className={cls.board_visibility_toggler__body__button}
                    onClick={() => setBoardVisibility(false)}
                >
                    <div
                        className={
                            cls.board_visibility_toggler__body__button__header
                        }
                    >
                        <Icon
                            icon="globe"
                            className={
                                cls.board_visibility_toggler__body__button__header__icon
                            }
                        />
                        <span
                            className={
                                cls.board_visibility_toggler__body__button__header__text
                            }
                        >
                            Public
                        </span>
                    </div>
                    <div
                        className={
                            cls.board_visibility_toggler__body__button__text
                        }
                    >
                        Anyone on the internet can see this
                    </div>
                </Button>
                <Button
                    className={cls.board_visibility_toggler__body__button}
                    onClick={() => setBoardVisibility(true)}
                >
                    <div
                        className={
                            cls.board_visibility_toggler__body__button__header
                        }
                    >
                        <Icon
                            icon="lock-closed"
                            className={
                                cls.board_visibility_toggler__body__button__header__icon
                            }
                        />
                        <span
                            className={
                                cls.board_visibility_toggler__body__button__header__text
                            }
                        >
                            Private
                        </span>
                    </div>
                    <div
                        className={
                            cls.board_visibility_toggler__body__button__text
                        }
                    >
                        Only board members can see this
                    </div>
                </Button>
            </div>
        </Dropdown>
    );
}
