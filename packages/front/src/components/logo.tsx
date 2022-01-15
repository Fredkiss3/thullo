import * as React from 'react';
import LogoSVG from '../images/logo.svg';
import cls from '../styles/components/logo.module.scss';

export function Logo(): JSX.Element {
    return (
        <div className={cls.logo}>
            <img src={LogoSVG} alt="Logo Thullo" className={cls.logo__img} />
            <span className={cls.logo__text}>Thullo</span>
        </div>
    );
}
