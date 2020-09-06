const middlewareObj = {};

middlewareObj.loginRequired = function(req, res, next) {
	if (!req.user) {
		return res.redirect('/user/login');
	}

	next();
};

module.exports = middlewareObj;
