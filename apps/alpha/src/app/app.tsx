import React, { Suspense } from 'react';
const AuthenticatedApp = React.lazy(() => import('./authenticated-app/app'));
const Login = React.lazy(() => import('./login'));

import {
  Routes,
  Route,
  useNavigate,
  useRoutes,
  useLocation,
} from 'react-router-dom';
import { useAuth } from './context/auth-context';
import Loading from './loading/loading';
import ModalView from '@alpha/app/modal-view/modal-view';
import Page from '@alpha/app/page';
import {routesTopicConfig} from "@alpha/app/routes";

function App() {
  const { user } = useAuth(); // 0 初始(加载中) 1 已登录 2 登录页
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/"
        element={
          user ? (
            <Suspense fallback={<Loading />}>
              <AuthenticatedApp />
            </Suspense>
          ) : (
            <Loading />
          )
        }
      />
      <Route
        path="*"
        element={
          user ? (
            <Suspense fallback={<Loading />}>
              <AuthenticatedApp />
            </Suspense>
          ) : (
            <Loading />
          )
        }
      />
      <Route path="/topic">
        {routesTopicConfig.map((item) => (
          <Route
            key={item.name}
            path={item.url}
            element={
              <Suspense fallback={<Loading />}>
                <Page>
                  <ModalView
                    show={true}
                    fn={() => {
                      navigate('/');
                    }}
                    title={item.title || item.name}
                  >
                    {item.component}
                  </ModalView>
                </Page>
              </Suspense>
            }
          />
        ))}
      </Route>
    </Routes>
  );
}
export default App;
