import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, Routes } from 'react-router-dom';
import cls from './App.module.scss';
import { CallBackPage } from './pages/callback';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { ProfilePage } from './pages/profile';
import { Error404Page } from './pages/404';
import { DashboardIndex } from './pages/dashboard';
import { DashboardLayout } from './pages/dashboard/layout';
import { ErrorProvider, errorReducer } from './context/ErrorContext';
import { useReducer } from 'react';

const queryClient = new QueryClient({
    // do not refetch on window focus
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 3600,
        },
    },
});

function App() {
    const [errors, dispatch] = useReducer(errorReducer, null);

    return (
        <ErrorProvider
            value={{
                errors,
                dispatch,
            }}
        >
            <QueryClientProvider client={queryClient}>
                <div className={cls.App}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/callback" element={<CallBackPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/dashboard" element={<DashboardLayout />}>
                            <Route path="" element={<DashboardIndex />} />
                        </Route>
                        <Route path="*" element={<Error404Page />} />
                    </Routes>
                </div>

                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ErrorProvider>
    );
}

export default App;
