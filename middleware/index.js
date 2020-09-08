const middlewareObj = {};

middlewareObj.loginRequired = function(req, res, next) {
	if (!req.user) {
		req.flash('error', 'You must login first');
		return res.redirect('/user/login');
	}

	next();
};

module.exports = middlewareObj;
