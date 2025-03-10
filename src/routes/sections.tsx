import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { useUser } from 'src/contexts/user-context';
import MyDonationsPage from 'src/pages/my-donations';
import TermsAndConditions from 'src/pages/terms-and-conditions';
import NotificationsPage from 'src/pages/notifications';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/users'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const DonationsPage = lazy(() => import('src/pages/donations'));
export const MyClaimsPage = lazy(() => import('src/pages/my-claims'));
export const ItemDetailsPage = lazy(() => import('src/pages/donation-item-details'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const PostDonationPage = lazy(() => import('src/pages/post-donation'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// Protected route component to check authentication
const ProtectedRoute = () => {
  const { user } = useUser();
  
  if (!user) {
    console.log('User is not logged in');
    return <Navigate to="/sign-in" replace />;
  } 
    console.log('%s logged in', user.email);
  
  
  return <Outlet />;
};

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <ProtectedRoute />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'donations', element: <DonationsPage /> },
        { path: 'post-donation', element: <PostDonationPage /> },
        { path: 'item-details/:id', element: <ItemDetailsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'my-claims', element: <MyClaimsPage /> },
        { path: 'my-donations', element: <MyDonationsPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'notifications', element: <NotificationsPage /> },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      ),
    },
    {
      path: 'terms-and-conditions',
      element: (
       
          <TermsAndConditions />
        
      ),
    },    
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
