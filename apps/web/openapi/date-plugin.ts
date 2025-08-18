import {
	type DefinePlugin,
	definePluginConfig,
	type IR,
} from "@hey-api/openapi-ts";

type UserConfig = {
	name: "date-convert";
	output?: string;
};
export type DatePlugin = DefinePlugin<UserConfig>;

const transformSchemaObject = (schema: IR.SchemaObject): IR.SchemaObject => {
	return schema;
};

const handler: DatePlugin["Handler"] = ({ plugin }) => {
	plugin.forEach("operation", "schema", (event) => {
		if (event.type === "schema") {
			event.schema = transformSchemaObject(event.schema);
			// console.dir(event, { depth: null });
		}
	});
};

export const defaultConfig: DatePlugin["Config"] = {
	name: "date-convert",
	handler,
	config: {},
	output: "date-convert",
	dependencies: [],
};

export const datePlugin = definePluginConfig(defaultConfig);
