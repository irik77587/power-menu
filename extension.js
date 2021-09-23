const Main = imports.ui.main;
const { St, GObject, Gio, GLib } = imports.gi;
const { panelMenu, popupMenu } = imports.ui;
const { extensionUtils, loginManager } = imports.misc;
const Me = extensionUtils.getCurrentExtension();
const { _systemActions } = Main.panel.statusArea.aggregateMenu._system;
const Session = loginManager.getLoginManager();
// const { hibernateCommand, hybridSleepCommand } = Me.imports.optional;

let powerMenu;
let settings;

// panelMenu.Button is a GObject, therefore only GObject can inherit it
const PowerMenu = GObject.registerClass({}, 
class PowerMenu extends panelMenu.Button{ _init() { super._init(0);
let icon = new St.Icon({ icon_name : 'system-shutdown-symbolic', style_class : 'system-status-icon'  });
this.add_child(icon);

this.menu.addMenuItem( ExtraPanelItem("Hibernate","Hibernate","hibernate-enabled") );
this.menu.addMenuItem( ExtraPanelItem("Hybrid Sleep","HybridSleep","hybrid-sleep-enabled") );
this.menu.addMenuItem( PanelItem("Power Off", "activatePowerOff") );
this.menu.addMenuItem( PanelItem("Suspend", "activateSuspend") );
this.menu.addMenuItem( PanelItem("Log Out", "activateLogout") );

}});

function PanelItem(itemName, itemCommand) {
	let item = new popupMenu.PopupMenuItem(_(itemName));
	// Error invoking connect, at argument 1 (callback): Not an object
	item.connect( 'activate', () => _systemActions[itemCommand]() );
	return item;
}

function ExtraPanelItem(itemName, itemCommand, visibility) {
	// https://github.com/arelange/gnome-shell-extension-hibernate-status
	const Command = () => Session._proxy.call(itemCommand,GLib.Variant.new('(b)', [true]),Gio.DBusCallFlags.NONE,-1, null, null);
	let item = new popupMenu.PopupMenuItem(_(itemName));
	settings.bind(visibility, item, 'visible', Gio.SettingsBindFlags.DEFAULT);
	item.connect( 'activate', Command );
	return item;
}
/*
function ExtraPanelItem(itemName, itemCommand, visibility) {
	let item = new popupMenu.PopupMenuItem(_(itemName));
	settings.bind(visibility, item, 'visible', Gio.SettingsBindFlags.DEFAULT);
	item.connect( 'activate', itemCommand );
	return item;
}
function hybridSleepCommand() {
    Session._proxy.call("HybridSleep",GLib.Variant.new('(b)', [true]),Gio.DBusCallFlags.NONE,-1, null, null);
}

function hibernateCommand() {
	Session._proxy.call("Hibernate",GLib.Variant.new('(b)', [true]),Gio.DBusCallFlags.NONE,-1, null, null);
}
*/
function init() {
	settings = extensionUtils.getSettings("org.gnome.shell.extensions.power-menu");
	settings.set_boolean( "hybrid-sleep-capable", false );
	settings.set_boolean( "hibernate-capable", false );
	// https://github.com/arelange/gnome-shell-extension-hibernate-status
	if(loginManager.haveSystemd()) {
		Session._proxy.call("CanHybridSleep",null,Gio.DBusCallFlags.NONE,-1, null,function(proxy, asyncResult){
			if(proxy.call_finish(asyncResult).deep_unpack()[0]!="no") settings.set_boolean( "hybrid-sleep-capable", true );
		});
		Session._proxy.call("CanHibernate",null,Gio.DBusCallFlags.NONE,-1, null, function (proxy, asyncResult) {
			if(proxy.call_finish(asyncResult).deep_unpack()[0]!="no") settings.set_boolean( "hibernate-capable", true );
		});
	}
}
function enable() {
	powerMenu = new PowerMenu();
	let children = Main.panel.get_children();
	// log(children.length)
	Main.panel.addToStatusArea('powerMenu', powerMenu, children.length);
}
function disable() { powerMenu.destroy(); }
/*
const St = imports.gi.St;
const Main = imports.ui.main;

let panelButton, panelButtonText;

function init() {
	panelButton = new St.Bin({ style_class : "panel-button"	});
	panelButtonText = new St.Label({
		style_class : "system-status-icon",
		text : "x"
	});
	panelButton.set_child(panelButtonText);
}

function enable() {
	Main.panel._rightBox.insert_child_at_index(panelButton, 1);
}

function disable() {
	Main.panel._rightBox.remove_child(panelButton);
}
*/
