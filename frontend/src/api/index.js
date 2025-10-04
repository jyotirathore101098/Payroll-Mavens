import axios from "axios";

// Set bypass header for development
if (process.env.NODE_ENV === "development") {
	axios.defaults.headers.common["x-test-bypass"] = "true";
}
