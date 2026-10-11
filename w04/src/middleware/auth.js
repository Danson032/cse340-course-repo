
export function requireLogin(req, res, next) {
    if (req.session?.user) {
        return next();
    }

    return res.redirect("/login");
}

export function requireRole(requiredRole) {
    return function (req, res, next) {
        if (!req.session?.user) {
            return res.redirect("/login");
        }

        if (req.session.user.role_name !== requiredRole) {
            return res.redirect("/dashboard?error=forbidden");
        }

        return next();
    };
}
