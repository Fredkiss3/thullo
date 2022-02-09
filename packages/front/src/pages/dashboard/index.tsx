import * as React from 'react';
import { Seo } from '../../components/seo';
import cls from '../../styles/pages/dashboard/index.module.scss';
import { Button } from '../../components/button';
import { Icon } from '../../components/icon';
import { useBoardsQuery } from '../../lib/hooks';
import { BoardCard } from '../../components/boardcard';
import { Modal } from '../../components/modal';
import { AddBoardForm } from '../../components/addboard-form';

export interface DashboardIndexProps {}

export const DashboardIndex: React.FC<DashboardIndexProps> = ({}) => {
    const { isLoading, data } = useBoardsQuery();
    return (
        <>
            <Seo title="Dashboard" />

            <section className={cls.header_section}>
                <h2>All Boards</h2>
                <AddBoardModal />
            </section>

            <section className={cls.card_section}>
                {isLoading ? (
                    <>
                        <BoardCard loading />
                        <BoardCard loading />
                        <BoardCard loading />
                    </>
                ) : data!.length > 0 ? (
                    data!.map((board) => (
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
