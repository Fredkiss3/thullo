import * as React from 'react';
import cls from '../styles/components/footer.module.scss';

export interface FooterProps {}

export function Footer({}: FooterProps) {
    return (
        <footer className={cls.footer}>
            <p>
                Created by&nbsp; Fredkiss3, for a{' '}
                <a href="https://devchallenges.io/challenges/wP0LbGgEeKhpFHUpPpDh">
                    <strong>devchallenges</strong>
                </a>
                , Check out the source code on &nbsp;
                <a href="https://github.com/Fredkiss3/thullo">
                    <strong>Github</strong>
                </a>
            </p>
        </footer>
    );
}
