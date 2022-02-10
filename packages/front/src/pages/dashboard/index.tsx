import * as React from 'react';
import { Seo } from '../../components/seo';
import cls from '../../styles/pages/dashboard/index.module.scss';
import { Button } from '../../components/button';
import { Icon } from '../../components/icon';
import { useAuthenticatedUser, useBoardsQuery } from '../../lib/hooks';
import { BoardCard } from '../../components/boardcard';
import { Modal } from '../../components/modal';
import { AddBoardForm } from '../../components/addboard-form';
import { categorizeBoards } from '../../lib/functions';
import { CategorizedBoards } from '../../lib/types';
import { useMemo } from 'react';

export interface DashboardIndexProps {}

export const DashboardIndex: React.FC<DashboardIndexProps> = ({}) => {
    const { isLoading, data } = useBoardsQuery();
    const { user } = useAuthenticatedUser();

    const boardCategorized = useMemo<CategorizedBoards>(() => {
        if (data && user) {
            return categorizeBoards(data, user);
        } else {
            return { self: [], public: [] };
        }
    }, [data, user]);

    return (
        <>
            <Seo title="Dashboard" />

            <section className={cls.header_section}>
                <h2>Your Boards</h2>
                <AddBoardModal />
            </section>

            <section className={cls.card_section}>
                {isLoading ? (
                    <>
                        <BoardCard loading />
                        <BoardCard loading />
                        <BoardCard loading />
                    </>
                ) : boardCategorized.self.length > 0 ? (
                    boardCategorized.self.map((board) => (
                        <React.Fragment key={board?.id}>
                            {board.id ? (
                                <BoardCard board={board} />
                            ) : (
                                <BoardCard loading />
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <p className={cls.card_section__empty}>No boards yet</p>
                )}
            </section>

            <section className={cls.header_section}>
                <h2>Public Boards</h2>
            </section>

            <section className={cls.card_section}>
                {isLoading ? (
                    <>
                        <BoardCard loading />
                        <BoardCard loading />
                        <BoardCard loading />
                    </>
                ) : boardCategorized.public.length > 0 ? (
                    boardCategorized.public.map((board) => (
                        <React.Fragment key={board?.id}>
                            {board.id ? (
                                <BoardCard board={board} />
                            ) : (
                                <BoardCard loading />
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <p className={cls.card_section__empty}>No boards yet</p>
                )}
            </section>
        </>
    );
};

const AddBoardModal = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const cancelButtonRef = React.useRef<HTMLButtonElement>(null);

    return (
        <>
            <Button
                variant={`primary`}
                onClick={() => setIsOpen(true)}
                renderLeadingIcon={(cls) => (
                    <Icon icon={`plus`} className={cls} />
                )}
            >
                Add Board
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                cancelButtonRef={cancelButtonRef}
            >
                <AddBoardForm
                    ref={cancelButtonRef}
                    onClose={() => setIsOpen(false)}
                />
            </Modal>
        </>
    );
};
