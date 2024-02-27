import { DateTime, Str } from "@cloudflare/itty-router-openapi";

export const Task = {
	name: new Str({ example: "lorem" }),
	slug: String,
	description: new Str({ required: false }),
	completed: Boolean,
	due_date: new DateTime(),
};

export const StatisticsCountries = {
	cached_at: DateTime,
	since: Date,
	until: Date,
	countries: [{
		name: new Str({ required: false }),
		code: new Str({ required: false }),
		players: Number,
	}]
};
