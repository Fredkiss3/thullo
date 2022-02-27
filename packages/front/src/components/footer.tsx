import * as React from 'react';
import cls from '../styles/components/footer.module.scss';

export interface FooterProps {}

export function Footer({}: FooterProps) {
    return (
        <footer className={cls.footer}>
            <p>
                Created by&nbsp;
                <a
                    href={`https://github.com/Fredkiss3`}
                    className={cls.footer__username}
                >
                    Fredkiss3
                </a>, devchallenges.io
            </p>
        </footer>
    );
}
