import { useState } from 'react';
import { boardHref, initialView } from './navigation';
import { Asset } from './ui';

export function Login() {
  const [notice, setNotice] = useState('');

  return (
    <div className="login-screen" lang="zh-Hans">
      <div className="login-panel">
        <header className="login-brand">
          <Asset name="swjtu-lockup.svg" alt="西南交通大学" className="login-brand__logo" />
          <h1>交大团团</h1>
        </header>

        <form className="login-form" autoComplete="off" noValidate onSubmit={event => {
          event.preventDefault();
          event.currentTarget.reset();
          window.location.hash = boardHref(initialView);
        }}>
          <label className="login-field">
            <span className="sr-only">学号</span>
            <input type="text" placeholder="学号" spellCheck={false} />
          </label>
          <label className="login-field">
            <span className="sr-only">密码</span>
            <input type="password" placeholder="密码" />
          </label>
          <button className="button button--primary" type="submit">登录</button>
          <button className="button login-form__sso" type="submit">学校统一身份认证</button>
          <div className="login-assistance">
            <div className="login-assistance__links">
              <button type="button" onClick={() => setNotice('登录帮助暂未开放')}>登录遇到问题</button>
              <span aria-hidden="true">｜</span>
              <button type="button" onClick={() => setNotice('用户注册暂未开放')}>用户注册</button>
            </div>
            <p className="login-assistance__notice" role="status">{notice}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
