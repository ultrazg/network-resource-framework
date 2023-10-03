import { useEffect, useState } from 'react';
import Header from './header/header';
import styled from 'styled-components';
import { Block } from '@network-resource-vis/block';
import { getValidImage } from '../api/login-service';
import message from './message/message';
import { useAuth } from './context/auth-context';
import axios, { CancelTokenStatic } from 'axios';
import { useViewport } from '@alpha/app/context/viewport-context';
interface LoginProps {}

const LoginContainer = styled.div`
  background: url('../assets/images/login/login_border.png') center center
    no-repeat;
  background-size: 100% 100%;
  width: 510px;
  height: 440px;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  .title {
    line-height: 28px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    font-size: 20px;

    text-align: center;
    margin-top: 40px;
  }
  .login-form-container {
    width: 302px;
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .form-item {
      width: 302px;
      height: 48px;
      border-bottom: 1px solid rgba(0, 173, 255, 0.2);
      font-weight: 400;
      font-size: 16px;
      display: flex;
      align-items: center;
      input {
        display: inline-block;
        width: 276px;
        height: 100%;
        margin-left: 8px;

        overflow: hidden;
        vertical-align: middle;
        border: 0px;
        -webkit-appearance: none; //把原来的样式整个抹掉
        outline: 0;
        background: 0 0;
        padding: 0;

        font-weight: 400;
        font-size: 16px;
        color: #ffffff;
        &::-webkit-input-placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
      }
      /* 99999s 基本上就是一个无限长的时间 通过延长增加自动填充背景色的方式,
      使用户感受不到样式的变化  */
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-transition-delay: 99999s;
        -webkit-transition: color 99999s ease-out,
          background-color 99999s ease-out;
      }

      .valid-code {
        width: 120px;
        height: 36px;
        background-color: #ffffff;
        color: navy;
        cursor: pointer;
      }
    }
  }
  .form-tool {
    width: 302px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0 64px 0;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    input {
      height: 16px;
      width: 16px;
    }

    button {
      background: 0 0;
      border: 0;
      line-height: 20px;
      font-weight: 400;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      text-align: justify;
      cursor: pointer;
    }
  }
  .main-button {
    width: 335px;
    height: 64px;
    background: url('../assets/images/login/login_button.png') center center
      no-repeat;
    /* background: #004fff; */
    /* border: 1px solid #00faff;
    box-shadow: inset 0 0 24px 0 rgba(0, 203, 255, 0.5); */
    border-radius: 5px;
    font-weight: 400;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 0;
    cursor: pointer;
  }
  .text-button {
  }
`;
const Row = styled.div`
  display: flex;
  align-items: center;
`;
const CheckBox = styled.div`
  height: 16px;
  width: 16px;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 2px;
  margin-right: 10px;
  &.checked {
    background: #00adff;
  }
`;
const Loading = styled.div`
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 0.6); */
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Login(props: LoginProps) {
  const { login, showLoading, reloadImage } = useAuth();

  const [ifRememberLoginStatus, SetIfRememberLoginStatus] = useState(true);
  const [verifyCodeId, setVerifyCodeId] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [verifyCodeInput, setVerifyCodeInput] = useState('');
  const [source, setSource] = useState<any>(axios.CancelToken.source());
  const [windowWidth] = useViewport();
  // 组件卸载，取消网络请求
  useEffect(() => {
    return () => {
      source.cancel('登录组件卸载，取消请求');
    };
  }, []);

  useEffect(() => {
    if (reloadImage) {
      handleValidCodeImage();
    }
  }, [reloadImage]);

  function handleValidCodeImage() {
    getValidImage({ cancelToken: source.token }).then((res) => {
      setVerifyCodeId(res.data.uuid);
      setImgURL(res.data.codeBase64);
    });
  }

  function handleForgetPassword() {
    console.log('forget password');
  }

  function handleLogin() {
    if (verifyCodeInput.length != 4) {
      message.warning({
        content: '验证码未完成输入',
      });
      return;
    }
    if (verifyCodeInput && loginPassword && loginName) {
      login({
        loginName,
        loginPassword,
        verifyCodeInput,
        verifyCodeId,
        ifRememberLoginStatus,
      });
    } else {
      if (!loginName) {
        message.warning({
          content: '用户名不能为空',
        });
      } else if (!loginPassword) {
        message.warning({
          content: '密码不能为空',
        });
      } else {
        message.warning({
          content: '验证码不能为空',
        });
      }
    }
  }

  return (
    <div
      className="resource"
      style={{
        zoom: `${windowWidth / 1920}`,
      }}
    >
      <div
        className="inner"
        style={{
          background: 'url(../assets/images/login/login_background.png)',
        }}
      >
        <Header hideTime={true} />
        <Block
          blockStyle={{
            top: '320px',
            right: 'calc(50% - 255px)',
            width: '510px',
            height: '440px',
          }}
          blockBackground={false}
          blockCorner={false}
        >
          <LoginContainer>
            <div className="title">登录</div>
            <form
              className="login-form-container"
              method="post"
              onSubmit={(event) => {
                event.preventDefault();
                return false;
              }}
            >
              <div className="form-item">
                <span className="iconfont icon-yonghuming"> </span>
                <input
                  placeholder="请输入用户名"
                  name="loginName"
                  type="text"
                  autoComplete="on"
                  value={loginName}
                  onChange={(e) => {
                    setLoginName(e.target.value);
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
              </div>
              <div className="form-item">
                <span className="iconfont icon-mimasuolock"> </span>
                <input
                  placeholder="请输入密码"
                  name="password"
                  type="password"
                  autoComplete="on"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
              </div>
              <div className="form-item">
                <span className="iconfont icon-yanzhengma-cuxiantiao1"> </span>
                <input
                  type="text"
                  placeholder="验证码"
                  autoComplete="off"
                  name="validCode"
                  value={verifyCodeInput}
                  onChange={(e) => {
                    if (e.target.value.length < 5) {
                      setVerifyCodeInput(e.target.value);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                />
                <div className="valid-code">
                  <img
                    src={`data:image/png;base64,${imgURL}`}
                    width={120}
                    height={36}
                    onClick={() => {
                      handleValidCodeImage();
                    }}
                  />
                </div>
              </div>
            </form>
            <div className="form-tool">
              <Row>
                <CheckBox
                  className={ifRememberLoginStatus ? 'checked' : ''}
                  onClick={() => {
                    SetIfRememberLoginStatus(!ifRememberLoginStatus);
                  }}
                >
                  {ifRememberLoginStatus && (
                    <span className="iconfont icon-xuanzhong-1"></span>
                  )}
                </CheckBox>
                记住密码
              </Row>
              <button
                className="text-button"
                onClick={(e) => {
                  handleForgetPassword();
                }}
                style={{ display: 'none' }}
              >
                忘记密码
              </button>
            </div>
            <div
              className="main-button"
              onClick={() => {
                handleLogin();
              }}
            ></div>
          </LoginContainer>
        </Block>
        {showLoading && (
          <Block
            blockStyle={{
              top: '320px',
              right: 'calc(50% - 255px)',
              width: '510px',
              height: '440px',
            }}
            blockBackground={false}
            blockCorner={false}
          >
            <Loading></Loading>
          </Block>
        )}
      </div>
    </div>
  );
}
export default Login;
