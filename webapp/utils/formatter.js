sap.ui.define(function () {
	"use strict";

	var formatter = {

		status: function (sStatus) {
		
			if (sStatus === "Open") {
				return "Error";
			} else if (sStatus === "Closed") {
				return "Success";
			} else {
				return "None";
			}
		}
	};

	return formatter;

});