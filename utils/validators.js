const isEmpty = string => {
	if (string.trim("") === "") return true
	else return false
}

const isEmail = string => {
	const regex = /^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+)\.([a-z]{2,20})(\.[a-z]{2,20})?$/
	if (string.match(regex)) return true
	else return false
}

const isPhoneNumber = phone => {
	const regex = /^\+(?:[0-9] ?){6,14}[0-9]$/
	if (phone.match(regex)) return true
	else return false
}

module.exports.validateRegisterInput = (
	firstName,
	lastName,
	middleName,
	dob,
	sex,
	street,
	city,
	email,
	password,
	confirmPassword,
	phoneNumber,
	country,
	state,
	bank,
	identification
) => {
	const errors = {}

	if (isEmpty(firstName)) errors.firstName = "First Name must not be empty"
	if (isEmpty(middleName)) errors.firstName = "Middle Name must not be empty"
	if (isEmpty(lastName)) errors.lastName = "Last Name must not be empty"
	if (isEmpty(dob)) errors.dob = "Date of Birth must not be empty"
	if (isEmpty(sex)) errors.sex = "Sex must not be empty"
	if (isEmpty(street)) errors.street = "Street must not be empty"
	if (isEmpty(city)) errors.city = "City must not be empty"
	if (isEmpty(password)) errors.password = "Password must not be empty"
	else if (confirmPassword !== password)
		errors.confirmPassword = "Passwords must match"
	if (isEmpty(email)) errors.email = "Email must not be empty"
	else if (!isEmail(email)) errors.email = "Invalid email"
	if (isEmpty(phoneNumber))
		errors.phoneNumber = "Phone Number must not be empty"
	else if (!isPhoneNumber(phoneNumber))
		errors.phoneNumber = "Please use +XXX XXXXXXXX fromat"
	if (isEmpty(country)) errors.country = "Country must not be empty"
	if (isEmpty(state)) errors.state = "State must not be empty"
	if (isEmpty(identification))
		errors.identification =
			"Please supply a means of identification - Upload a scanned image of: the front page of your international passport / Voter's card / DrivingDriver's Licence / the front page of a bank statement."
	if (isEmpty(bank.name)) errors.bankName = "Bank Name must not be empty"
	if (isEmpty(bank.acctName)) errors.acctName = "Account Name must not be empty"
	if (isEmpty(bank.acctNo)) errors.acctNo = "Account Number must not be empty"
	else if (!parseFloat(bank.acctNo)) errors.acctNo = "Invalid Account Number"

	return {
		errors,
		valid: Object.keys(errors) < 1
	}
}

module.exports.validateLoginInput = (email, password) => {
	const errors = {}

	if (isEmpty(email)) errors.email = "Email must not be empty"
	else if (!isEmail(email)) errors.email = "Invalid Email"
	if (isEmpty(password)) errors.password = "Password must not be empty"

	return {
		errors,
		valid: Object.keys(errors) < 1
	}
}

module.exports.validateRegisterAdmin = (
	firstName,
	lastName,
	password,
	confirmPassword,
	email
) => {
	const errors = {}

	if (isEmpty(firstName)) errors.firstName = "First Name must not be empty"
	if (isEmpty(lastName)) errors.lastName = "Last Name must not be empty"
	if (isEmpty(email)) errors.email = "Email must not be empty"
	else if (!isEmail(email)) errors.email = "Invalid Email"
	if (isEmpty(password)) errors.password = "Password must not be empty"
	else if (confirmPassword !== password)
		errors.confirmPassword = "Passwords must match"

	return {
		errors,
		valid: Object.keys(errors) < 1
	}
}

module.exports.validateBuy = (amount, platform, walletId) => {
	const errors = {}

	if (isEmpty(amount.toString())) errors.amount = "Amount must not be empty"
	else if (!parseFloat(amount)) errors.amount = "Amount must be a number"
	if (isEmpty(platform)) errors.platform = "Platform must not be empty"
	if (isEmpty(walletId)) errors.walletId = "Wallt Id must not be empty"

	return {
		errors,
		valid: Object.keys(errors) < 1
	}
}

module.exports.validateSell = (amount, platform) => {
	const errors = {}

	if (isEmpty(amount.toString())) errors.amount = "Amount must not be empty"
	else if (!parseFloat(amount)) errors.amount = "Amount must be a number"
	if (isEmpty(platform)) errors.platform = "Platform must not be empty"

	return {
		errors,
		valid: Object.keys(errors) < 1
	}
}

module.exports.validateUploadRate = (
	bitcoin,
	ethereum,
	paypal,
	webMoney,
	perfectMoney
) => {
	const errors = {}

	if (isEmpty(bitcoin.buy.toString())) errors.bitcoinBuy = "Must not be empty"
	else if (!parseFloat(bitcoin.buy)) errors.bitcoinBuy = "Must be a number"

	if (isEmpty(bitcoin.sell.toString())) errors.bitcoinSell = "Must not be empty"
	else if (!parseFloat(bitcoin.sell)) errors.bitcoinSell = "Must be a number"

	if (isEmpty(ethereum.buy.toString())) errors.ethereumBuy = "Must not be empty"
	else if (!parseFloat(ethereum.buy)) errors.ethereumBuy = "Must be a number"

	if (isEmpty(ethereum.sell.toString()))
		errors.ethereumSell = "Must not be empty"
	else if (!parseFloat(ethereum.sell)) errors.ethereumSell = "Must be a number"

	if (isEmpty(paypal.buy.toString())) errors.paypalBuy = "Must not be empty"
	else if (!parseFloat(paypal.buy)) errors.paypalBuy = "Must be a number"

	if (isEmpty(paypal.sell.toString())) errors.paypalSell = "Must not be empty"
	else if (!parseFloat(paypal.sell)) errors.paypalSell = "Must be a number"

	if (isEmpty(webMoney.buy.toString())) errors.webMoneyBuy = "Must not be empty"
	else if (!parseFloat(webMoney.buy)) errors.webMoneyBuy = "Must be a number"

	if (isEmpty(webMoney.sell.toString()))
		errors.webMoneySell = "Must not be empty"
	else if (!parseFloat(webMoney.sell)) errors.webMoneySell = "Must be a number"

	if (isEmpty(perfectMoney.buy.toString()))
		errors.perfectMoneyBuy = "Must not be empty"
	else if (!parseFloat(perfectMoney.buy))
		errors.perfectMoneyBuy = "Must be a number"

	if (isEmpty(perfectMoney.sell.toString()))
		errors.perfectMoneySell = "Must not be empty"
	else if (!parseFloat(perfectMoney.sell))
		errors.perfectMoneySell = "Must be a number"

	return {
		errors,
		valid: Object.keys(errors) < 1
	}
}
