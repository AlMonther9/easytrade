/**
 * EasyTrade — دخول Google / LinkedIn (login.html + create.html)
 *
 * فيه Client ID حقيقي والصفحة على https/localhost → OAuth حقيقي.
 * غير كده → محاكاة تجريبية بنفس الشكل، فالبروتوتايب يفضل شغال على file://.
 *
 * ملاحظة أمان: التحقق من توكن جوجل/لينكدإن بيتم هنا في المتصفح لعرض البروفايل بس.
 * أي صلاحية فعلية لازم تتأكد منها على سيرفر (verify the ID token server-side).
 */
(function () {
    'use strict';

    var AUTH_CONFIG = {
        google: {
            // Google Cloud Console → Credentials → OAuth client ID (Web application)
            clientId: ''
        },
        linkedin: {
            // LinkedIn Developer → app → "Sign In With LinkedIn 2" product
            clientId: ''
        },
        // بعد تسجيل الدخول: مفتاح مسار من easytrade-routes.js
        returnTo: 'onboarding'
    };

    var SESSION_KEY = 'easytrade.session';

    var MOCK_ACCOUNTS = {
        google: [
            { name: 'Mariam Fawzy', email: 'mariam.fawzy@gmail.com' },
            { name: 'Kareem Diab', email: 'kareem.diab@gmail.com' }
        ],
        linkedin: [
            { name: 'Mariam Fawzy', email: 'm.fawzy@acme-trade.com' },
            { name: 'Kareem Diab', email: 'k.diab@apex-textiles.com' }
        ]
    };

    var PROVIDER_LABEL = { google: 'Google', linkedin: 'LinkedIn' };

    /* ---------- helpers ---------- */

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            var el = document.querySelector('script[src="' + src + '"]');
            if (el && el.dataset.loaded) { resolve(); return; }
            if (!el) {
                el = document.createElement('script');
                el.src = src;
                el.async = false;
                document.head.appendChild(el);
            }
            el.addEventListener('load', function () { el.dataset.loaded = '1'; resolve(); });
            el.addEventListener('error', function () { reject(new Error('تعذّر تحميل ' + src)); });
        });
    }

    function canUseRealOAuth() {
        var host = location.hostname;
        return location.protocol === 'https:' || host === 'localhost' || host === '127.0.0.1';
    }

    function providerMode(provider) {
        return (AUTH_CONFIG[provider].clientId && canUseRealOAuth()) ? 'real' : 'mock';
    }

    function readSession() {
        try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
    }

    function writeSession(session) {
        session.signedInAt = Date.now();
        try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) { /* خاصية تصفح مقفلة */ }
        return session;
    }

    function clearSession() {
        try { localStorage.removeItem(SESSION_KEY); } catch (e) { }
    }

    function goAfterSignIn() {
        location.href = window.EasyTrade.url(AUTH_CONFIG.returnTo);
    }

    function initials(name) {
        return (name || '?').trim().split(/\s+/).slice(0, 2)
            .map(function (w) { return w.charAt(0); }).join('').toUpperCase();
    }

    /* ---------- feedback line on the page ---------- */

    function feedbackHost(button) {
        var group = button.closest('.social-auth');
        return group || button.parentElement;
    }

    function showMessage(button, text, kind) {
        var host = feedbackHost(button);
        var line = host.parentElement.querySelector('.et-auth-message');
        if (!line) {
            line = document.createElement('p');
            line.className = 'et-auth-message';
            line.setAttribute('role', 'status');
            host.insertAdjacentElement('afterend', line);
        }
        line.textContent = text;
        line.dataset.kind = kind || 'info';
        return line;
    }

    function renderSignedInState(host) {
        var session = readSession();
        if (!session) return;

        var line = document.createElement('p');
        line.className = 'et-auth-message';
        line.dataset.kind = 'ok';

        var avatar = document.createElement('span');
        avatar.className = 'et-auth-avatar';
        avatar.textContent = initials(session.name);

        var label = document.createElement('span');
        label.textContent = 'مسجّل دخولك بالفعل كـ ' + session.name + ' عبر ' +
            (PROVIDER_LABEL[session.provider] || session.provider);

        var signOut = document.createElement('button');
        signOut.type = 'button';
        signOut.className = 'et-auth-link';
        signOut.textContent = 'تسجيل الخروج';
        signOut.addEventListener('click', function () {
            clearSession();
            line.remove();
        });

        line.append(avatar, label, signOut);
        host.insertBefore(line, host.firstChild);
    }

    /* ---------- mock account picker ---------- */

    function openMockPicker(provider, button) {
        var accounts = MOCK_ACCOUNTS[provider];
        var title = 'اختر حساباً للمتابعة إلى EasyTrade';

        var backdrop = document.createElement('div');
        backdrop.className = 'et-auth-backdrop';

        var dialog = document.createElement('div');
        dialog.className = 'et-auth-picker';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-label', title);

        var heading = document.createElement('h3');
        heading.textContent = title;

        var sub = document.createElement('p');
        sub.className = 'et-auth-sub';
        sub.textContent = 'وضع تجريبي — أضف Client ID في social-auth.js (' +
            PROVIDER_LABEL[provider] + ') لتفعيل الدخول الحقيقي.';

        var list = document.createElement('ul');

        var close = document.createElement('button');
        close.type = 'button';
        close.className = 'et-auth-close';
        close.setAttribute('aria-label', 'إغلاق');
        close.textContent = '×';

        function shut() {
            backdrop.remove();
            document.removeEventListener('keydown', onKey, true);
            if (button) button.focus();
        }

        function onKey(e) {
            if (e.key === 'Escape') { e.preventDefault(); shut(); }
        }

        close.addEventListener('click', shut);
        backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) shut(); });
        document.addEventListener('keydown', onKey, true);

        accounts.forEach(function (account) {
            var item = document.createElement('li');
            var pick = document.createElement('button');
            pick.type = 'button';
            pick.className = 'et-auth-account';

            var avatar = document.createElement('span');
            avatar.className = 'et-auth-avatar';
            avatar.textContent = initials(account.name);

            var names = document.createElement('span');
            names.className = 'et-auth-names';
            var nameEl = document.createElement('strong');
            nameEl.textContent = account.name;
            var mailEl = document.createElement('small');
            mailEl.textContent = account.email;
            names.append(nameEl, mailEl);

            pick.append(avatar, names);
            pick.addEventListener('click', function () {
                shut();
                finishSignIn({
                    provider: provider,
                    name: account.name,
                    email: account.email,
                    picture: '',
                    mock: true
                }, button);
            });

            item.appendChild(pick);
            list.appendChild(item);
        });

        dialog.append(close, heading, sub, list);
        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);
        list.querySelector('button').focus();
    }

    function finishSignIn(session, button) {
        writeSession(session);
        if (button) showMessage(button, 'أهلاً ' + session.name + '، جاري الدخول…', 'ok');
        setTimeout(goAfterSignIn, 400);
    }

    /* ---------- Google: real OAuth ---------- */

    function signInWithGoogle(button) {
        loadScript('https://accounts.google.com/gsi/client').then(function () {
            var client = window.google.accounts.oauth2.initTokenClient({
                client_id: AUTH_CONFIG.google.clientId,
                scope: 'openid email profile',
                callback: function (response) {
                    if (response.error) {
                        showMessage(button, 'اترفض دخول جوجل: ' + response.error, 'error');
                        return;
                    }
                    fetch('https://openidconnect.googleapis.com/v1/userinfo', {
                        headers: { Authorization: 'Bearer ' + response.access_token }
                    }).then(function (r) { return r.json(); }).then(function (profile) {
                        finishSignIn({
                            provider: 'google',
                            name: profile.name || profile.email,
                            email: profile.email,
                            picture: profile.picture || ''
                        }, button);
                    });
                }
            });
            client.requestAccessToken();
        }).catch(function (err) {
            showMessage(button, err.message, 'error');
            openMockPicker('google', button);
        });
    }

    /* ---------- LinkedIn: real OAuth (authorization code + PKCE) ---------- */

    var LI_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
    var LI_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';
    var LI_STATE_KEY = 'easytrade.linkedin.state';

    function randomToken() {
        var bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        return base64url(bytes.buffer);
    }

    function base64url(buffer) {
        var text = Array.prototype.map.call(new Uint8Array(buffer), function (b) {
            return String.fromCharCode(b);
        }).join('');
        return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function sha256Base64Url(value) {
        var data = new TextEncoder().encode(value);
        return crypto.subtle.digest('SHA-256', data).then(base64url);
    }

    function startLinkedInSignIn(button) {
        var redirectUri = location.origin + location.pathname;
        var verifier = randomToken();

        sha256Base64Url(verifier).then(function (challenge) {
            var state = randomToken();
            sessionStorage.setItem(LI_STATE_KEY, JSON.stringify({ verifier: verifier, state: state }));

            var params = new URLSearchParams({
                response_type: 'code',
                client_id: AUTH_CONFIG.linkedin.clientId,
                redirect_uri: redirectUri,
                scope: 'openid profile email',
                state: state,
                code_challenge: challenge,
                code_challenge_method: 'S256'
            });
            location.href = 'https://www.linkedin.com/oauth/v2/authorization?' + params.toString();
        });
    }

    function handleLinkedInCallback(button) {
        var query = new URLSearchParams(location.search);
        var code = query.get('code');
        var state = query.get('state');
        if (!code) return false;

        var stored;
        try { stored = JSON.parse(sessionStorage.getItem(LI_STATE_KEY)); } catch (e) { stored = null; }
        sessionStorage.removeItem(LI_STATE_KEY);

        function clean() {
            history.replaceState(null, '', location.pathname);
        }

        if (!stored || stored.state !== state) {
            showMessage(button, 'انتهت جلسة دخول LinkedIn، جرّب تاني.', 'error');
            clean();
            return true;
        }

        showMessage(button, 'جاري إكمال دخول LinkedIn…', 'info');

        fetch(LI_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                client_id: AUTH_CONFIG.linkedin.clientId,
                code_verifier: stored.verifier,
                redirect_uri: location.origin + location.pathname
            })
        }).then(function (r) { return r.json(); }).then(function (token) {
            if (!token.access_token) throw new Error(token.error_description || 'رفض LinkedIn الطلب');
            return fetch(LI_USERINFO_URL, {
                headers: { Authorization: 'Bearer ' + token.access_token }
            }).then(function (r) { return r.json(); });
        }).then(function (profile) {
            clean();
            finishSignIn({
                provider: 'linkedin',
                name: profile.name || profile.email,
                email: profile.email,
                picture: profile.picture || ''
            }, button);
        }).catch(function (err) {
            clean();
            showMessage(button, 'فشل دخول LinkedIn: ' + err.message, 'error');
        });

        return true;
    }

    /* ---------- wiring ---------- */

    function providerOf(button) {
        var forced = button.dataset.provider;
        if (forced) return forced;
        var label = (button.textContent || '').trim().toLowerCase();
        if (label.indexOf('google') === 0) return 'google';
        if (label.indexOf('linkedin') === 0) return 'linkedin';
        return '';
    }

    function init() {
        var host = document.querySelector('.social-auth');
        if (!host) return;

        var buttons = Array.prototype.slice.call(host.querySelectorAll('.social-btn'));
        if (!buttons.length) return;

        var linkedinButton = null;
        buttons.forEach(function (button) {
            var provider = providerOf(button);
            if (!provider) return;
            if (provider === 'linkedin') linkedinButton = button;
            button.addEventListener('click', function () {
                if (providerMode(provider) === 'real') {
                    if (provider === 'google') signInWithGoogle(button);
                    else startLinkedInSignIn(button);
                    return;
                }
                openMockPicker(provider, button);
            });
        });

        if (AUTH_CONFIG.linkedin.clientId && canUseRealOAuth()) {
            handleLinkedInCallback(linkedinButton || buttons[0]);
        }

        renderSignedInState(host);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.EasyTradeAuth = {
        config: AUTH_CONFIG,
        session: readSession,
        signOut: clearSession,
        mode: providerMode
    };
})();
