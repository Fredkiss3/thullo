import { Route, Routes } from 'react-router-dom';
import cls from './App.module.scss';
import { IndexPage } from './pages';
import { CallBackPage } from './pages/callback';
import { LoginPage } from './pages/login';

function App() {
    return (
        <div className={cls.App}>
            <h1>Thullo </h1>

            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/callback" element={<CallBackPage />} />
            </Routes>
        </div>
    );
}

export default App;
