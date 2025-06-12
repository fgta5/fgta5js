export function getInvalidMessage(name, input, defaultMessage) {
	var msg = input.getAttribute(`invalid-message-${name}`);
	if (msg == null || msg === '') {
		msg = defaultMessage;
	}
	return msg;
}


export function parseFunctionParam(paramString) {
	const [fnName, ...fnParams] = paramString.split(":");
	const fnParamsString = fnParams.length > 0 ? fnParams.join(":") : null;
	
	return {
		fnName,
		fnParams: fnParamsString !== null 
			? (!isNaN(fnParamsString) ? Number(fnParamsString) : fnParamsString) 
			: null
	};
}


export function required(value) {
	if (value === null || value === undefined || value === '') {
		return false;		
	}
	return true;
}

export function minlength(value, minLength) {
	if (minLength == null || minLength === 0) {
		return true; // no minimum length specified, so always valid
	}
	if (value == null || value.length < minLength) {
		return false; // value is too short
	}
	return true; // value meets the minimum length requirement
}

export function maxlength(value, maxLength) {
	if (maxLength == null || maxLength === 0) {
		return true; // no maximum length specified, so always valid
	}
	if (value == null || value.length > maxLength) {
		return false; // value is too long
	}
	return true; // value meets the maximum length requirement
}

export function pattern(value, strpattern) {
	return true; // TODO: implement pattern validation
}

export function email(value, minLength) {
	return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

export function min(value, minValue) {
	if (minValue == null || minValue === 0) {
		return true; // no minimum value specified, so always valid
	}
	if (value == null || value < minValue) {
		return false; // value is less than minimum
	}
	return true; // value meets the minimum requirement
}

export function max(value, maxValue) {
	if (maxValue == null || maxValue === 0) {
		return true; // no maximum value specified, so always valid
	}
	if (value == null || value > maxValue) {
		return false; // value is greater than maximum
	}
	return true; // value meets the maximum requirement
}


function parseDate(value, boundaryDate) {
	var dtparsed = new Date(value)
	var dt = new Date(dtparsed.getFullYear(), dtparsed.getMonth(), dtparsed.getDate())
	var boundary = new Date(boundaryDate.getFullYear(), boundaryDate.getMonth(), boundaryDate.getDate())
	return {
		dt: dt,
		boundary: boundary
	}
}

export function mindate(value, minDate) {
	var {dt, boundary} = parseDate(value, minDate)
	if (dt<boundary) {
		return false
	} else {
		return true
	}
}

export function maxdate(value, maxDate) {
	var {dt, boundary} = parseDate(value, maxDate)
	if (dt>boundary) {
		return false
	} else {
		return true
	}
	
}


export function mintime(value, minTime) {
	if (value<minTime) {
		return false
	} else {
		return true
	}
}

export function maxtime(value, maxTime) {
	if (value>maxTime) {
		return false
	} else {
		return true
	}
}