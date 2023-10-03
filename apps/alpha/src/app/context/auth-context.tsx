import { MD5 } from 'crypto-js';
import React, { useEffect, useMemo, useState } from 'react';
import { loginService, verifyToken } from '../../api/login-service';
import message from '../message/message';

import { useLocation, useNavigate } from 'react-router-dom';

const AuthContext = React.createContext({
  user: 0,
  login: (loginInfo: loginInfoObj) => {},
  logout: () => {},
  register: () => {},
  showLoading: false,
  reloadImage: false,
});

/* eslint-disable-next-line */
export interface AuthProviderProps {}
interface loginInfoObj {
  verifyCodeInput: string;
  loginPassword: string;
  ifRememberLoginStatus: boolean;
  loginName: string;
  verifyCodeId: string;
}
function AuthProvider(props: AuthProviderProps) {
  const navigate = useNavigate();
  let location = useLocation();
  const [user, setUser] = useState(0); // 0 初始 1 已登录 2 未登录
  const [showLoading, setShowLoading] = useState(false);
  const [reloadImage, setReloadImage] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token.toString() === 'null' || token === 'TOKEN_EXPIRED') {
      setUser(2);
      if (token === 'TOKEN_EXPIRED') {
        message.warning({ content: '登录验证过期，请重新登录' });
        window.localStorage.setItem('token', '');
      }
    } else {
      // 探路精兵
      verifyToken().then((res) => {
        if (res.code === 200) {
          setUser(1);
        } else {
          message.warning({ content: '登录验证未通过，请重新登录' });
          window.localStorage.setItem('token', '');
          setUser(2);
        }
      });
    }
  }, []);

  useEffect(() => {
    // setUser(1); // HACK 临时使用，屏蔽登录
    if (user === 1 && location.pathname.includes('login')) {
      navigate('/');
    } else if (user === 2) {
      navigate('/login');
    }
  }, [user]);
  const login = (loginInfo: loginInfoObj) => {
    // 点击登录后开启登录框的loading状态，防止用户反复发送登录请求
    setShowLoading(true);
    setReloadImage(false);
    const salt = '88f241dc6d0e33c40aeabf9f040bac71';
    const encrypted = MD5(loginInfo.loginPassword + salt);
    loginService({
      imageVerificationCode: loginInfo.verifyCodeInput,
      password: encrypted.toString(),
      rememberMe: loginInfo.ifRememberLoginStatus,
      username: loginInfo.loginName,
      uuid: loginInfo.verifyCodeId,
    })
      .then((res) => {
        setShowLoading(false);
        if (res.code === 200) {
          // message.success({ content: '登录成功' });
          window.localStorage.setItem('token', res.data);
          setUser(1);
        } else if (res.code === 2003) {
          message.error({ content: '验证码不正确' });
          setReloadImage(true);
        } else {
          setReloadImage(true);
          if (res.msg) {
            message.error({ content: res.msg });
          } else {
            message.error({ content: '不允许的输入' });
          }
        }
      })
      .catch((e) => {
        console.log('login failed', e);
        setShowLoading(false);
      });
    return false;
  }; // make a login request
  const register = () => {}; // register the user
  const logout = () => {
    setUser(2);
  }; // clear the token in localStorage and the user data

  const value = useMemo(
    () => ({ login, logout, register, user, showLoading, reloadImage }),
    [login, logout, register, user, showLoading, reloadImage]
  );
  return <AuthContext.Provider value={value} {...props} />;
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
