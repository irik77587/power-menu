const { Gio } = imports.gi;
const extension = imports.misc.extensionUtils.getCurrentExtension();
// https://github.com/negesti/gnome-shell-extensions-negesti/blob/7cf7737e46f3158db13216e29e6a02b85952169f/utils.js
/**
 * getSettings:
 * @schema: (optional): the GSettings schema id
 *
 * Builds and return a GSettings schema for @schema, using schema files
 * in extensionsdir/schemas. If @schema is not provided, it is taken from
 * metadata["settings-schema"].
 */
function getSettings(schema) {
	schema = schema || extension.metadata['settings-schema'];
	const GioSSS = Gio.SettingsSchemaSource;

	// check if this extension was built with "make zip-file", and thus
	// has the schema files in a subfolder
	// otherwise assume that extension has been installed in the
	// same prefix as gnome-shell (and therefore schemas are available
	// in the standard folders)
	let schemaDir = extension.dir.get_child('schemas');
	let schemaSource;
	if (schemaDir.query_exists(null))
		schemaSource = GioSSS.new_from_directory(schemaDir.get_path(),
		GioSSS.get_default(),false);
	else
		schemaSource = GioSSS.get_default();

	let schemaObj = schemaSource.lookup(schema, true);
	if (!schemaObj)
	throw new Error('Schema ' + schema + ' could not be found for extension '
		+ extension.metadata.uuid + '. Please check your installation.');

	return new Gio.Settings({ settings_schema: schemaObj });
}
