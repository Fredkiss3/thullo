import * as React from 'react';

// Functions & Other
import { useNavigate, useParams } from 'react-router-dom';
import {
    useRemoveMemberMutation,
    useSingleBoardQuery,
    useUserQuery,
} from '@/lib/queries';
import { useToastContext } from '@/context/toast.context';
import { useDropdownToggle, useOnClickOutside } from '@/lib/hooks';

import type { BoardDetails, BoardMember, User } from '@/lib/types';

// Components
import { Loader } from '@/components/loader';
import { Seo } from '@/components/seo';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Avatar } from '@/components/avatar';
import { MemberSearch } from '@/components/member-search';
import { Dropdown } from '@/components/dropdown';
import { BoardVisilityDropdown } from '@/components/board-visibility-toggler';
import { Drawer } from '@/components/drawer';
import { ColumnsSection } from '@/components/column-section';
import { Outlet } from 'react-router-dom';

// styles
import cls from '@/styles/pages/dashboard/board.module.scss';

export function DashboardDetails() {
    const { boardId } = useParams<{ boardId: string }>();
    const { data: board, isLoading } = useSingleBoardQuery(boardId!);
    const { data: user } = useUserQuery();
    const { dispatch } = useToastContext();

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isLoading && !board) {
            dispatch({
                type: 'ADD_ERROR',
                key: 'board-not-found',
                message: 'The board you are looking for does not exist.',
            });
            navigate('/dashboard');
        }
    }, [board, isLoading]);

    // When the board is not found, we render null to avoid rendering the layout
    if (!board && !isLoading) {
        return <></>;
    }

    const isBoardAdmin = user?.id === board?.admin.id;
    const isParticipant =
        board?.participants.some(
            (participant) => participant.id === user?.id
        ) || isBoardAdmin;

    return (
        <Layout
            unConstrained
            currentPageTitle={isLoading ? 'Loading...' : board!.name}
            containerClassName={cls.details_page}
        >
            <Seo title={board?.name ?? 'Board Details'} />
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <HeaderSection
                        {...board!}
                        currentUser={user!}
                        userIsBoardAdmin={isBoardAdmin}
                        userIsParticipant={isParticipant}
                    />
                    <ColumnsSection
                        {...board!}
                        userIsParticipant={isParticipant}
                    />
                </>
            )}

            <Outlet />
        </Layout>
    );
}

function HeaderSection({
    userIsBoardAdmin,
    userIsParticipant,
    participants,
    isPrivate,
    currentUser,
    admin,
    id,
}: BoardDetails & {
    userIsBoardAdmin: boolean;
    userIsParticipant: boolean;
    currentUser: User | null;
}) {
    const [showDrawer, setShowDrawer] = React.useState(false);

    const [inviteButtonRef, showInviteDropdown, toggleInviteDropdown] =
        useDropdownToggle();
    const [
        toggleButtonRef,
        showVisibilityTogglerDropdown,
        toggleVisibilityTogglerDropdown,
    ] = useDropdownToggle();

    const participantsFiltered = React.useMemo(
        () =>
            currentUser
                ? [admin, ...participants].filter(
                      (m) => m.id !== currentUser.id
                  )
                : [admin, ...participants],
        [admin, participants, currentUser]
    );

    return (
        <section className={cls.header_section}>
            <div className={cls.header_section__left}>
                <div
                    className={cls.header_section__left__toggle_btn}
                    ref={toggleButtonRef}
                >
                    <Button
                        disabled={!userIsBoardAdmin}
                        renderLeadingIcon={(cls) => (
                            <Icon
                                className={cls}
                                icon={isPrivate ? 'lock-closed' : 'globe'}
                            />
                        )}
                        isStatic={isPrivate}
                        variant={isPrivate ? 'black' : 'hollow'}
                        onClick={toggleVisibilityTogglerDropdown}
                    >
                        {isPrivate ? 'Private' : 'Public'}
                    </Button>

                    <BoardVisilityDropdown
                        boardId={id}
                        isBoardPrivate={isPrivate}
                        show={showVisibilityTogglerDropdown}
                    />
                </div>
                <ul className={cls.header_section__left__participant_list}>
                    {participantsFiltered.map((p) => (
                        <AvatarButton
                            key={p.id}
                            member={p}
                            boardId={id}
                            canRemove={userIsBoardAdmin}
                        />
                    ))}

                    {(userIsParticipant || userIsBoardAdmin) && (
                        <div
                            className={cls.header_section__left__invite_btn}
                            ref={inviteButtonRef}
                        >
                            <Button
                                square
                                variant="primary"
                                onClick={toggleInviteDropdown}
                                renderTrailingIcon={(cls) => (
                                    <Icon icon="plus" className={cls} />
                                )}
                            />

                            {showInviteDropdown && (
                                <MemberSearch boardId={id} show />
                            )}
                        </div>
                    )}
                </ul>
            </div>
            <div className={cls.header_section__right}>
                <Button
                    variant="outline"
                    renderLeadingIcon={(cls) => (
                        <Icon icon="h-dots" className={cls} />
                    )}
                    onClick={() => {
                        setShowDrawer(true);
                    }}
                >
                    Show Menu
                </Button>

                <Drawer
                    open={showDrawer}
                    onClose={() => setShowDrawer(false)}
                />
            </div>
        </section>
    );
}

function AvatarButton({
    member,
    boardId,
    canRemove,
}: {
    member: BoardMember;
    boardId: string;
    canRemove: boolean;
}) {
    const [avatarRef, showAvatarMenu, toggleAvatarMenu] = useDropdownToggle();

    const mutation = useRemoveMemberMutation();
    const { dispatch } = useToastContext();

    const removeMember = React.useCallback(() => {
        mutation.mutate({
            boardId,
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

    return (
        <div className={cls.avatar_wrapper} ref={avatarRef}>
            <Button
                disabled={!canRemove}
                className={cls.avatar_wrapper__button}
                onClick={toggleAvatarMenu}
            >
                <Avatar
                    photoURL={member.avatarURL}
                    name={member.name}
                    username={member.login}
                />
            </Button>

            {showAvatarMenu && (
                <Dropdown
                    align={`right`}
                    className={cls.avatar_wrapper__dropdown}
                >
                    <Button
                        variant={`danger-hollow`}
                        className={cls.avatar_wrapper__dropdown__button}
                        onClick={removeMember}
                    >
                        Remove from Board
                    </Button>
                </Dropdown>
            )}
        </div>
    );
}
