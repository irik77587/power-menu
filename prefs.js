const { GObject, Gtk, Gio, GLib } = imports.gi;
const { extensionUtils } = imports.misc;
const Me = extensionUtils.getCurrentExtension();
const _ = imports.gettext.domain(Me.metadata.uuid).gettext;

let settings;
const haveSystemd = (GLib.access("/run/systemd/seats", 0) >= 0);

function init() {
	settings = extensionUtils.getSettings("org.gnome.shell.extensions.power-menu");
	if(!haveSystemd) {
		settings.set_boolean( "hibernate-capable", false );
		settings.set_boolean( "hybrid-sleep-capable", false );
		settings.set_boolean( "hibernate-enabled", false );
		settings.set_boolean( "hybrid-sleep-enabled", false );
		Gio.Settings.sync();
	}
}

function buildPrefsWidget() {
	let widget = new Gtk.Box({ orientation : Gtk.Orientation.VERTICAL, spacing : 15, margin : 20 });
	
	if(haveSystemd) {
		widget.add(buildSwitcher("hybrid-sleep-capable","hybrid-sleep-enabled","Enable Hybrid Sleep button"));
		widget.add(buildSwitcher("hibernate-capable","hibernate-enabled","Enable Hibernate button"));
	} else { 
		widget.pack_start(new Gtk.Label({ label: _("Systemd is required but not found") }), true, true, 1);
	}
	widget.show_all();
	return widget;
}
/*
const MyPrefsWidget = new GObject.Class({
	Name : "My.Prefs.Widget",
	GTypeName : "MyPrefsWidget",
	Extends : Gtk.Box,
	
	_init : function(params) {
		this.parent(params);
		this.margin = 20;
		this.set_spacing(15);
		this.set_orientation(Gtk.Orientation.VERTICAL);
		
		this.add(buildSwitcher("hybrid-sleep","Enable Hybrid Sleep button"));
		this.add(buildSwitcher("hibernate","Enable Hibernate button"));
	}
});
*/
function buildSwitcher(key, value, labelText) {
    let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });
    let label = new Gtk.Label({ label: _(labelText), xalign: 0 });
    let switcher = new Gtk.Switch({ active: settings.get_boolean(value) });
    settings.bind(value, switcher, 'active', Gio.SettingsBindFlags.DEFAULT);
    switcher.set_sensitive(settings.get_boolean(key));
    hbox.pack_start(label, true, true, 0);
    hbox.add(switcher);
    return hbox;
}
