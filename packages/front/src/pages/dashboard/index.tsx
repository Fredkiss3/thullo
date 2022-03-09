import * as React from 'react';
// Functions & Others
import { categorizeBoards } from '@/lib/functions';
import type { CategorizedBoards } from '@/lib/types';
import { useToastContext } from '@/context/toast.context';

// Components
import { Seo } from '@/components/seo';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { useBoardsQuery, useUserQuery } from '@/lib/queries';
import { BoardCard } from '@/components/boardcard';
import { Modal } from '@/components/modal';
import { AddBoardForm } from '@/components/addboard-form';
import { useMemo } from 'react';
import { Layout } from '@/components/Layout';

// styles
import cls from '@/styles/pages/dashboard/index.module.scss';

export function DashboardIndex() {
    const { isLoading, data: boards } = useBoardsQuery();
    const { data: user } = useUserQuery();

    const boardCategorized = useMemo<CategorizedBoards>(() => {
        if (boards && user) {
            return categorizeBoards(boards, user);
        } else {
            return { self: [], public: boards ?? [] };
        }
    }, [boards, user]);

    return (
        <Layout className={cls.page}>
            <Seo title="Dashboard" />

            {user && (
                <>
                    <section className={cls.header_section}>
                        <h2>Your Boards</h2>
                        <AddBoardModal />
                    </section>

                    <section
                        className={cls.card_section}
                        data-test-id="user-board-list"
                    >
                        {isLoading ? (
                            <>
                                <BoardCard loading />
                                <BoardCard loading />
                                <BoardCard loading />
                                <BoardCard loading />
                            </>
                        ) : boardCategorized.self.length > 0 ? (
                            boardCategorized.self.map((board, index) => (
                                <React.Fragment key={board?.id ?? index}>
                                    {board.id ? (
                                        <BoardCard board={board} />
                                    ) : (
                                        <BoardCard loading />
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <p className={cls.card_section__empty}>
                                No boards yet
                            </p>
                        )}
                    </section>
                </>
            )}

            <section className={cls.header_section}>
                <h2>Public Boards</h2>
            </section>

            <section
                className={cls.card_section}
                data-test-id="public-board-list"
            >
                {isLoading ? (
                    <>
                        <BoardCard loading />
                        <BoardCard loading />
                        <BoardCard loading />
                        <BoardCard loading />
                    </>
                ) : boardCategorized.public.length > 0 ? (
                    boardCategorized.public.map((board, index) => (
                        <React.Fragment key={board?.id ?? index}>
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
        </Layout>
    );
}

function AddBoardModal() {
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
                    onClose={() => {
                        setIsOpen(false);
                    }}
                />
            </Modal>
        </>
    );
}
