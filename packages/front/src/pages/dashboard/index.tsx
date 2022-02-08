import * as React from 'react';
import { Seo } from '../../components/seo';
import cls from '../../styles/pages/dashboard/index.module.scss';
import { Button } from '../../components/button';
import { Icon } from '../../components/icon';
import { useBoardsQuery } from '../../lib/hooks';
import { BoardCard } from '../../components/boardcard';

export interface DashboardIndexProps {}

export const DashboardIndex: React.FC<DashboardIndexProps> = ({}) => {
    const { isLoading, data } = useBoardsQuery();
    return (
        <>
            <Seo title="Dashboard" />

            <section className={cls.header_section}>
                <h2>All Boards</h2>
                <Button
                    variant={`primary`}
                    onClick={() => {
                        console.log('Create new board');
                    }}
                    renderIcon={(cls) => <Icon icon={`plus`} className={cls} />}
                >
                    Add Board
                </Button>
            </section>

            <section className={cls.card_section}>
                {isLoading ? (
                    <>
                        <BoardCard />
                        <BoardCard />
                        <BoardCard />
                    </>
                ) : data!.length > 0 ? (
                    data!.map((board) => (
                        <BoardCard key={board.id} board={board} />
                    ))
                ) : (
                    <p className={cls.card_section__empty}>No boards yet</p>
                )}
            </section>
        </>
    );
};
