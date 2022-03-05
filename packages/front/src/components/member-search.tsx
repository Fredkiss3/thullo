import * as React from 'react';

// Functions & Others
import { debounce, formatAPIError, jsonFetch } from '@/lib/functions';
import type { ApiErrors, BoardMember } from '@/lib/types';

// Components
import { Dropdown } from '@/components/dropdown';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';

// Styles
import cls from '@/styles/components/member-search.module.scss';
import { useToastContext } from '@/context/toast.context';
import { Avatar } from '@/components/avatar';
import { Skeleton } from '@/components/skeleton';
import { useInviteMemberMutation } from '@/lib/queries';

export interface MemberSearchProps {
    show?: boolean;
    boardId: string;
}

export function MemberSearch({ show, boardId }: MemberSearchProps) {
    const { dispatch } = useToastContext();
    const mutation = useInviteMemberMutation();

    // For the query
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedMembers, setSelectedMembers] = React.useState<BoardMember[]>(
        []
    );

    // For the dropdown
    const [foundMembers, setFoundMembers] = React.useState<BoardMember[]>([]);

    // Search for members
    const searchMembers = React.useCallback(
        debounce(async (value: string) => {
            let data: BoardMember[] = [];
            let errors: ApiErrors = null;

            if (value.length > 0) {
                const params = new URLSearchParams();
                params.append('query', value);
                params.append('boardId', boardId);
                params.append('limit', '10');

                setIsLoading(true);
                ({ data, errors } = await jsonFetch<BoardMember[]>(
                    `${
                        import.meta.env.VITE_API_URL
                    }/api/members/search?${params.toString()}`
                ));
                setIsLoading(false);
            }

            if (errors !== null) {
                // Show toasts
                dispatch({
                    type: 'ADD_TOASTS',
                    toasts: formatAPIError(errors),
                });
                return;
            } else {
                setFoundMembers(data);
            }
        }, 500),
        []
    );

    const selectMember = (newMember: BoardMember) => {
        setSelectedMembers((oldMembers) => {
            // Add the member if it's not already in the list
            const index = oldMembers.findIndex((m) => m.id === newMember.id);

            setSearchQuery('');

            if (index === -1) {
                return [...oldMembers, newMember];
            } else {
                return oldMembers;
            }
        });
    };

    const deleteMember = (member: BoardMember) => {
        setSelectedMembers((oldMembers) => {
            const newMembers = [...oldMembers];
            const index = newMembers.findIndex((m) => m.id === member.id);

            if (index !== -1) {
                newMembers.splice(index, 1);
            }

            return newMembers;
        });
    };

    const handleSearch = React.useCallback((value: string) => {
        setSearchQuery((_) => {
            setIsLoading(true);
            searchMembers(value);
            return value;
        });
    }, []);

    const inviteSelectedMembers = React.useCallback(() => {
        mutation.mutate({
            boardId,
            members: selectedMembers,
            onSuccess: () => {
                dispatch({
                    type: 'ADD_SUCCESS',
                    key: `board-invite-${new Date().getTime()}`,
                    message: 'Members added successfully to the board.',
                });
                setSelectedMembers([]);
            },
        })
    }, [
        mutation,
        selectedMembers,
    ]);

    return (
        <Dropdown
            align="right"
            className={`${cls.member_search} ${
                show && cls['member_search--open']
            }`}
        >
            <div className={cls.member_search__header}>
                <strong className={cls.member_search__header__title}>
                    Invite to Board
                </strong>
                <p className={cls.member_search__header__description}>
                    Search users you want to invite to
                </p>
            </div>

            <div className={cls.member_search__input}>
                <Input
                    value={searchQuery}
                    className={cls.member_search__input__field}
                    onChange={handleSearch}
                    placeholder="User..."
                    trailingElement={
                        <Button
                            square
                            variant="primary"
                            isStatic
                            renderLeadingIcon={(cls) => (
                                <Icon icon="search" className={cls} />
                            )}
                        />
                    }
                />

                {searchQuery.length > 0 && (
                    <Dropdown className={cls.member_search__input__results}>
                        <ul className={cls.member_search__input__results__list}>
                            {isLoading ? (
                                <>
                                    {Array.from([1, 2, 3]).map((i) => (
                                        <li
                                            key={i}
                                            className={`${cls.member_search__input__results__list__item}
                                            ${cls.member_search__input__results__list__item_placeholder}
                                            `}
                                        >
                                            <Skeleton
                                                className={
                                                    cls.member_search__input__results__list__item__avatar
                                                }
                                            />
                                            <div
                                                className={
                                                    cls.member_search__input__results__list__item__name
                                                }
                                            >
                                                <Skeleton />
                                                <Skeleton />
                                            </div>
                                        </li>
                                    ))}
                                </>
                            ) : foundMembers.length > 0 ? (
                                foundMembers.map((member) => (
                                    <Button
                                        key={member.id}
                                        className={
                                            cls.member_search__input__results__list__item
                                        }
                                        onClick={() => selectMember(member)}
                                    >
                                        <Avatar
                                            name={member.name}
                                            username={member.login}
                                            className={
                                                cls.member_search__input__results__list__item__avatar
                                            }
                                            photoURL={member.avatarURL}
                                        />
                                        <div
                                            className={
                                                cls.member_search__input__results__list__item__name
                                            }
                                        >
                                            <div>{member.name}</div>
                                            <small>@{member.login}</small>
                                        </div>
                                    </Button>
                                ))
                            ) : (
                                <li
                                    className={
                                        cls.member_search__input__results__list__empty
                                    }
                                >
                                    No members found for the query &nbsp;
                                    <strong>{searchQuery}</strong>
                                </li>
                            )}
                        </ul>
                    </Dropdown>
                )}
            </div>

            {selectedMembers.length > 0 ? (
                <ul className={cls.member_search__selected_members}>
                    {selectedMembers.map((member) => (
                        <li
                            key={member.id}
                            className={
                                cls.member_search__selected_members__item
                            }
                        >
                            <div>
                                <Avatar
                                    className={
                                        cls.member_search__selected_members__item__avatar
                                    }
                                    name={member.name}
                                    username={member.login}
                                    photoURL={member.avatarURL}
                                />

                                <div
                                    className={
                                        cls.member_search__selected_members__item__name
                                    }
                                >
                                    <p>{member.name}</p>
                                    <small>@{member.login}</small>
                                </div>
                            </div>

                            <Button
                                onClick={() => deleteMember(member)}
                                square
                                disabled={mutation.isLoading}
                                variant={`danger`}
                                renderTrailingIcon={(cls) => (
                                    <Icon icon="x-icon" className={cls} />
                                )}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={cls.member_search__selected_members_empty}>
                    Search for a member to add
                </p>
            )}

            <Button
                disabled={selectedMembers.length === 0 || mutation.isLoading}
                variant={`primary`}
                onClick={inviteSelectedMembers}
            >
                {mutation.isLoading ? 'Adding members...' : 'Invite'}
            </Button>
        </Dropdown>
    );
}
