const USER_COOKIE = "gig_market_session";
const ADMIN_COOKIE = "gig_market_admin_session";

const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/"
};

const setUserSession = (res, token) => {
    res.cookie(USER_COOKIE, token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

const setAdminSession = (res, token) => {
    res.cookie(ADMIN_COOKIE, token, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000
    });
};

const clearUserSession = (res) => {
    res.clearCookie(USER_COOKIE, cookieOptions);
};

const clearAdminSession = (res) => {
    res.clearCookie(ADMIN_COOKIE, cookieOptions);
};

const parseCookies = (header) => {
    const cookies = {};
    for (const part of String(header || "").split(";")) {
        const separator = part.indexOf("=");
        if (separator === -1) continue;
        const name = part.slice(0, separator).trim();
        const value = part.slice(separator + 1).trim();
        try {
            cookies[name] = decodeURIComponent(value);
        } catch {
            cookies[name] = value;
        }
    }
    return cookies;
};

const getCookie = (req, name) => parseCookies(req.headers.cookie)[name];

module.exports = {
    USER_COOKIE,
    ADMIN_COOKIE,
    setUserSession,
    setAdminSession,
    clearUserSession,
    clearAdminSession,
    getCookie
};
