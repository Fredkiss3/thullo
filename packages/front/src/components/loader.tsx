import * as React from 'react';
import cls from '../styles/components/loader.module.scss';

export const Loader: React.FC = ({}) => {
    return <div className={cls.loader}>Loading...</div>;
};
