const isEmpty = string => {
	if (!string || string.trim("") === "") return true;
	else return false;
};

const isEmail = string => {
	const regex =
		// eslint-disable-next-line no-useless-escape
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (string.match(regex)) return true;
	else return false;
};

module.exports.validateRegisterInput = (
	firstName,
	lastName,
	email,
	password,
	confirmPassword
) => {
	const errors = {};

	if (isEmpty(firstName)) errors.firstName = "First Name must not be empty";
	if (isEmpty(lastName)) errors.lastName = "Last Name must not be empty";
	if (isEmpty(password)) errors.password = "Password must not be empty";
	else if (confirmPassword !== password)
		errors.confirmPassword = "Passwords must match";
	if (isEmpty(email)) errors.email = "Email must not be empty";
	else if (!isEmail(email)) errors.email = "Invalid email";

	return {
		errors,
		valid: Object.keys(errors) < 1
	};
};

module.exports.validateLoginInput = (email, password) => {
	const errors = {};

	if (isEmpty(email)) errors.email = "Email must not be empty";
	else if (!isEmail(email)) errors.email = "Invalid Email";
	if (isEmpty(password)) errors.password = "Password must not be empty";

	return {
		errors,
		valid: Object.keys(errors) < 1
	};
};

module.exports.validateLoginInput = (email, password) => {
	const errors = {};

	if (isEmpty(email)) errors.email = "Email must not be empty";
	else if (!isEmail(email)) errors.email = "Invalid Email";
	if (isEmpty(password)) errors.password = "Password must not be empty";

	return {
		errors,
		valid: Object.keys(errors) < 1
	};
};

module.exports.validateRegisterAdmin = (
	firstName,
	lastName,
	password,
	confirmPassword,
	email
) => {
	const errors = {};

	if (isEmpty(firstName)) errors.firstName = "First Name must not be empty";
	if (isEmpty(lastName)) errors.lastName = "Last Name must not be empty";
	if (isEmpty(email)) errors.email = "Email must not be empty";
	else if (!isEmail(email)) errors.email = "Invalid Email";
	if (isEmpty(password)) errors.password = "Password must not be empty";
	else if (confirmPassword !== password)
		errors.confirmPassword = "Passwords must match";

	return {
		errors,
		valid: Object.keys(errors) < 1
	};
};

module.exports.validateBroadcastId = broadCastId => {
	const errors = {};

	if (isEmpty(broadCastId)) errors.email = "Broadcast Id must not be empty";

	return {
		errors,
		valid: Object.keys(errors) < 1
	};
};

module.exports.validateCreateBroadcast = ({
	name,
	categoryId,
	airingTime,
	link
}) => {
	const errors = {};

	if (isEmpty(name)) errors.name = "Broadcast Name must not be empty";
	if (isEmpty(airingTime)) errors.airingTime = "Airing Time must not be empty";
	if (isEmpty(categoryId)) errors.categoryId = "Category must not be empty";
	if (isEmpty(link)) errors.link = "Link must not be empty";

	return {
		errors,
		valid: Object.keys(errors) < 1
	};
};

module.exports.validateCreateCateogory = (name, image) => {
	const errors = {};

	if (isEmpty(name)) errors.name = "Category Name must not be empty";
	if (isEmpty(image)) errors.image = "Category Image must not be empty";

	return {
		errors,
		valid: Object.keys(errors) < 1
	};
};

module.exports.validateDate = date => {
	const errors = {};

	if (isEmpty(date)) errors.date = "Date must not be empty";

	return {
		errors,
		valid: Object.keys(errors) < 1
	};
};

module.exports.validateResetUserPassword = (userId, password) => {
	const errors = {};

	if (isEmpty(userId)) errors.userId = "User Id must not be empty";

	if (isEmpty(password)) errors.password = "Password must not be empty";

	return {
		errors,
		valid: Object.keys(errors) < 1
	};
};
