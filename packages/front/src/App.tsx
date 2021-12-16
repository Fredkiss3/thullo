import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, Routes } from 'react-router-dom';
import cls from './App.module.scss';
import { CallBackPage } from './pages/callback';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { ProfilePage } from './pages/profile';

const queryClient = new QueryClient({
    // do not refetch on window focus
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: Infinity,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className={cls.App}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/callback" element={<CallBackPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </div>

            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
