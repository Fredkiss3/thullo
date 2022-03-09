// External
import { useReducer } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, Routes } from 'react-router-dom';

// Functions & Others
import { errorReducer, ErrorContext } from './context/error.context';
import { ToastContext, toastReducer } from '@/context/toast.context';

// components
import { CallBackPage } from './pages/callback';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { ProfilePage } from './pages/profile';
import { Error404Page } from './pages/404';
import { DashboardIndex } from './pages/dashboard';
import { DashboardDetails } from './pages/dashboard/board';
import { ToastArea } from '@/components/toast-area';

const queryClient = new QueryClient({
    // do not refetch on window focus
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 3600_000,
        },
    },
});

function App() {
    const [toasts, toastDispatcher] = useReducer(toastReducer, null);
    const [errors, dispatch] = useReducer(errorReducer, null);

    return (
        <ErrorContext.Provider
            value={{
                errors,
                dispatch,
            }}
        >
            <ToastContext.Provider
                value={{
                    toasts,
                    dispatch: toastDispatcher,
                }}
            >
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/callback" element={<CallBackPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/dashboard" element={<DashboardIndex />} />
                        <Route
                            path="/dashboard/:boardId"
                            element={<DashboardDetails />}
                        />
                        <Route path="*" element={<Error404Page />} />
                    </Routes>
                    <ReactQueryDevtools initialIsOpen={false} />
                    <ToastArea />
                </QueryClientProvider>
            </ToastContext.Provider>
        </ErrorContext.Provider>
    );
}

export default App;
