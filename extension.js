const Main = imports.ui.main;
const { St, GObject, Gio, GLib } = imports.gi;
const { panelMenu, popupMenu } = imports.ui;
const { extensionUtils, loginManager } = imports.misc;
const Me = extensionUtils.getCurrentExtension();
const _systemActions = imports.misc.systemActions.getDefault();
const Session = loginManager.getLoginManager();
const { getSettings } = Me.imports.convenience;

let powerMenu;
let settings;

class PowerMenu extends panelMenu.Button { constructor() { super(0);
	// But panelMenu.Button is a GObject, not a js object.
	let icon = new St.Icon({ icon_name : 'system-shutdown-symbolic', style_class : 'system-status-icon'  });
	this.actor.add_child(icon);
	
	this.menu.addMenuItem( ExtraPanelItem("suspend-hibernate-enabled","Hybrid Sleep","SuspendThenHibernate") );
	this.menu.addMenuItem( ExtraPanelItem("hybrid-sleep-enabled","Hybrid Sleep","HybridSleep") );
	this.menu.addMenuItem( ExtraPanelItem("hibernate-enabled","Hibernate","Hibernate") );
	
	// ui.status.system.Indicator()
	this.menu.addMenuItem(PanelItem("can-logout", "activateLogout", "Log Out"));
	this.menu.addMenuItem(PanelItem("can-lock-orientation", "activateLockOrientation", "Orientation Lock"));
	this.menu.addMenuItem(PanelItem("can-lock-screen", "activateLockScreen", "Lock"));
	this.menu.addMenuItem(PanelItem("can-suspend", "activateSuspend", "Suspend"));
	this.menu.addMenuItem(PanelItem("can-power-off", "activatePowerOff", "Power Off"));	
}};

function PanelItem(visible, itemCommand, itemName) {
	let bindFlags = GObject.BindingFlags.DEFAULT | GObject.BindingFlags.SYNC_CREATE;
	let item = new popupMenu.PopupMenuItem(_(itemName));
	_systemActions.bind_property(visible,item.actor,'visible',bindFlags);
	item.connect( 'activate', () => _systemActions[itemCommand]() );
	return item;
}

function ExtraPanelItem(visible, itemName, itemCommand) {
	let item = new popupMenu.PopupMenuItem(_(itemName));
	settings.bind(visible,item.actor,'visible',Gio.SettingsBindFlags.DEFAULT);
	//settings.bind(visible, item, 'visible', Gio.SettingsBindFlags.DEFAULT);
	//item.connect( 'activate', itemCommand );
	item.connect( 'activate', () => Session._proxy.call(itemCommand,GLib.Variant.new('(b)', [true]),Gio.DBusCallFlags.NONE,-1, null, null));
	return item;
}
/*
function hybridSleepCommand() {
	Session._proxy.call("HybridSleep",GLib.Variant.new('(b)', [true]),Gio.DBusCallFlags.NONE,-1, null, null);
}

function hibernateCommand() {
	Session._proxy.call("Hibernate",GLib.Variant.new('(b)', [true]),Gio.DBusCallFlags.NONE,-1, null, null);
}
*/
function init() {
	settings = getSettings("org.gnome.shell.extensions.power-menu");
	// https://github.com/arelange/gnome-shell-extension-hibernate-status
	if(loginManager.haveSystemd()) {
		Session._proxy.call("CanSuspendThenHibernate",null,Gio.DBusCallFlags.NONE,-1, null,function(proxy, asyncResult){
			if(proxy.call_finish(asyncResult).deep_unpack()[0]!="no") settings.set_boolean( "suspend-hibernate-capabled", true );
		});
		Session._proxy.call("CanHybridSleep",null,Gio.DBusCallFlags.NONE,-1, null,function(proxy, asyncResult){
			if(proxy.call_finish(asyncResult).deep_unpack()[0]!="no") settings.set_boolean( "hybrid-sleep-capable", true );
		});
		Session._proxy.call("CanHibernate",null,Gio.DBusCallFlags.NONE,-1, null, function (proxy, asyncResult) {
			if(proxy.call_finish(asyncResult).deep_unpack()[0]!="no") settings.set_boolean( "hibernate-capable", true );
		});
	}else{
		settings.set_boolean( "suspend-hibernate-capabled", true );
		settings.set_boolean( "hybrid-sleep-capable", false );
		settings.set_boolean( "hibernate-capable", false );
	}
}
function enable() {
	powerMenu = new PowerMenu();
	let children = Main.panel._rightBox.get_children();
	Main.panel.addToStatusArea('powerMenu', powerMenu, children.length);
}
function disable() { powerMenu.destroy(); }
