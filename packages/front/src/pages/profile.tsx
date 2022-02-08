import * as React from 'react';
import { useAuthenticatedUser } from '../lib/hooks';
import { Layout } from '../components/Layout';
import { Seo } from '../components/seo';
import { Loader } from '../components/loader';
import cls from '../styles/pages/profile.module.scss';
import { Avatar } from '../components/avatar';

export interface ProfilePageProps {}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
    const { user, isLoading } = useAuthenticatedUser();

    return isLoading || !user ? (
        <Loader />
    ) : (
        <Layout currentPageTitle={'Profile'} className={cls.profile_container}>
            <Seo title="Profile" />

            <h1 className={cls.profile_container__title}>Personal Info :</h1>

            <p className={cls.profile_container__paragraph}>
                Basic Info, like your name and photo
            </p>

            <ul className={cls.profile_container__panel}>
                <li className={cls.profile_container__panel__header}>
                    <h2>Profile</h2>
                    <p>None of your personal info will be shared with anyone</p>
                </li>
                <li className={cls.profile_container__panel__field}>
                    <div className={cls.profile_container__panel__field__title}>
                        PHOTO
                    </div>
                    <Avatar
                        photoURL={user.avatarURL}
                        name={user.name}
                        className={`${cls.profile_container__panel__field__avatar} ${cls.profile_container__panel__field__value}`}
                    />
                </li>

                <li className={cls.profile_container__panel__field}>
                    <div className={cls.profile_container__panel__field__title}>
                        NAME
                    </div>
                    <div className={cls.profile_container__panel__field__value}>{user.name}</div>
                </li>

                <li className={cls.profile_container__panel__field}>
                    <div className={cls.profile_container__panel__field__title}>
                        LOGIN
                    </div>
                    <div className={cls.profile_container__panel__field__value}>{user.login}</div>
                </li>

                <li className={cls.profile_container__panel__field}>
                    <div className={cls.profile_container__panel__field__title}>
                        EMAIL
                    </div>

                    <div className={cls.profile_container__panel__field__value}>{user.email}</div>
                </li>
            </ul>
        </Layout>
    );
};
