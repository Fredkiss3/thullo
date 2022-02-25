import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '../../components/loader';
import { Seo } from '../../components/seo';
import { useSingleBoardQuery, useUserQuery } from '../../lib/queries';
import { DashboardLayout } from './layout';
import cls from '../../styles/pages/dashboard/board.module.scss';
import { BoardDetails } from '../../lib/types';
import { Button } from '../../components/button';
import { Icon } from '../../components/icon';
import { Avatar } from '../../components/avatar';

export interface DashboardDetailsProps {}

export function DashboardDetails(props: DashboardDetailsProps) {
    const { boardId } = useParams<{ boardId: string }>();
    const { data: user } = useUserQuery();
    const { data: board, isLoading } = useSingleBoardQuery(boardId!);

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isLoading && !board) {
            navigate('/dashboard');
        }
    }, [board, isLoading]);

    // When the board is not found, we render null to avoid rendering the layout
    if (board === null) {
        return null;
    }

    const isBoardAdmin = user?.id === board?.admin.id;
    const isParticipant =
        board?.participants.some(
            (participant) => participant.id === user?.id
        ) ?? false;

    return (
        <DashboardLayout
            headerTitle={isLoading ? 'Loading...' : board!.name}
            className={cls.details_page}
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
        </DashboardLayout>
    );
}

function HeaderSection({
    userIsBoardAdmin,
    userIsParticipant,
    participants,
    isPrivate,
}: BoardDetails & {
    userIsBoardAdmin: boolean;
    userIsParticipant: boolean;
}) {
    return (
        <section className={cls.details_page__header}>
            <div className={cls.details_page__header__left}>
                <Button
                    disabled={!userIsBoardAdmin}
                    renderLeadingIcon={(cls) => (
                        <Icon
                            className={cls}
                            icon={isPrivate ? 'lock-closed' : 'lock-open'}
                        />
                    )}
                    isStatic={isPrivate}
                    variant={isPrivate ? 'black' : 'hollow'}
                >
                    {isPrivate ? 'Private' : 'Public'}
                </Button>

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
                    variant="hollow"
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
