/// <reference path="../lib/openrct2.d.ts" />

import { startup } from "./startup";

registerPlugin({
	name: "Map Resizer",
	version: "1.1",
	authors: [ "fidwell" ],
	type: "remote",
	licence: "MIT",
	targetApiVersion: 93,
	main: startup
});
