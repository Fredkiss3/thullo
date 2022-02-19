import * as React from 'react';
import cls from '../styles/components/footer.module.scss';

export interface FooterProps {}

export function Footer({}: FooterProps) {
    return (
        <footer className={cls.footer}>
            <p>
                Created by{' '}
                <a
                    href={`https://github.com/Fredkiss3`}
                    className={cls.footer__username}
                >
                    Fredkiss3
                </a>{' '}
            </p>
            <p>&copy;Thullo 2022</p>
        </footer>
    );
}
