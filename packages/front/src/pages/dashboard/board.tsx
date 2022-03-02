import * as React from 'react';

// Functions & Other
import { useNavigate, useParams } from 'react-router-dom';
import { useSingleBoardQuery, useUserQuery } from '@/lib/queries';
import { useToastContext } from '@/context/toast.context';
import type { BoardDetails } from '@/lib/types';

// Components
import { Loader } from '@/components/loader';
import { Seo } from '@/components/seo';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Avatar } from '@/components/avatar';

// styles
import cls from '@/styles/pages/dashboard/board.module.scss';
import { BoardVisilityDropdown } from '@/components/board-visibility-toggler';
import { useOnClickOutside } from '@/lib/hooks';

export function DashboardDetails() {
    const { boardId } = useParams<{ boardId: string }>();
    const { data: user } = useUserQuery();
    const { data: board, isLoading } = useSingleBoardQuery(boardId!);
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
        ) ?? false;

    return (
        <Layout
            unConstrained
            currentPageTitle={isLoading ? 'Loading...' : board!.name}
            containerClassName={cls.details_page}
        >
            <Seo title="Dashboard Details" />
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <HeaderSection
                        {...board!}
                        userIsBoardAdmin={isBoardAdmin}
                        userIsParticipant={isParticipant}
                    />
                    <ColumnsSection {...board!} />
                </>
            )}
        </Layout>
    );
}

function HeaderSection({
    userIsBoardAdmin,
    userIsParticipant,
    participants,
    isPrivate,
    id,
}: BoardDetails & {
    userIsBoardAdmin: boolean;
    userIsParticipant: boolean;
}) {
    const [showVisibilityTogglerDropdown, setShowVisibilityTogglerDropdown] =
        React.useState(false);

    const toggleButtonRef = React.useRef(null);

    // when the user clicks outside of the cover dropdown, close it
    useOnClickOutside(toggleButtonRef, () => {
        setShowVisibilityTogglerDropdown(false);
    });

    return (
        <section className={cls.details_page__header}>
            <div className={cls.details_page__header__left}>
                <div
                    className={cls.details_page__header__left__toggle_btn}
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
                        onClick={() =>
                            setShowVisibilityTogglerDropdown(
                                !showVisibilityTogglerDropdown
                            )
                        }
                    >
                        {isPrivate ? 'Private' : 'Public'}
                    </Button>

                    <BoardVisilityDropdown
                        boardId={id}
                        isBoardPrivate={isPrivate}
                        show={showVisibilityTogglerDropdown}
                    />
                </div>
                <ul
                    className={cls.details_page__header__left__participant_list}
                >
                    {participants.map(({ id, name, avatarURL, login }) => (
                        <li key={id}>
                            <Avatar
                                photoURL={avatarURL}
                                name={name}
                                username={login}
                            />
                        </li>
                    ))}

                    {userIsParticipant ||
                        (userIsBoardAdmin && (
                            <Button
                                square
                                variant="primary"
                                renderTrailingIcon={(cls) => (
                                    <Icon icon="plus" className={cls} />
                                )}
                            />
                        ))}
                </ul>
            </div>
            <div className={cls.details_page__header__right}>
                <Button
                    variant="outline"
                    renderLeadingIcon={(cls) => (
                        <Icon icon="h-dots" className={cls} />
                    )}
                >
                    Show Menu
                </Button>
            </div>
        </section>
    );
}

function ColumnsSection({ lists }: BoardDetails) {
    return <section className={cls.details_page__columns}></section>;
}
