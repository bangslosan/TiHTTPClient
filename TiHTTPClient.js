var TIMEOUT = 60000;

// HTTP request abstraction
exports.request = function(dict) {
	var dict = dict || {};

	// Create HTTP request
	var xhr = Ti.Network.createHTTPClient({
		timeout: dict.timeout || TIMEOUT,
		onload: function() {
			Ti.API.info("SUCCESS:", this.responseText);

			var data;
			try {
				data = JSON.parse(this.responseText);
			} catch (e) {
				data = this.responseText;
			}

			if (typeof dict.onload === "function") {
				dict.onload({
					data: data,
					xhr: xhr
				}, false);
			}
		},
		onerror: function(e) {
			Ti.API.info("ERROR:", this.responseText);

			if (typeof dict.onerror === "function") {
				dict.onerror(e.error, true);
			}
		},
		oncancel: function() {
			Ti.API.info("CANCELED:", this.responseText);

			if (typeof dict.oncancel === "function") {
				dict.oncancel(null, true);
			}
		}
	});

	// Open Request
	xhr.open(dict.type, dict.url);

	// Add Headers to HTTP request, after opening the request.
	if (typeof dict.headers !== "undefined") {
		dict.headers.forEach(function(header) {
			xhr.setRequestHeader( header.name, header.value );
			console.log("HEADER (" + header.name + "):", header.value);
		});
	}

	// Just show some informations in console
	Ti.API.info("URL: " + serviceURL);
	Ti.API.info("TYPE: " + dict.type);
	Ti.API.info(dict.data);

	// Start request
	xhr.send(dict.data);
};