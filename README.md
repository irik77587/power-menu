# power-menu
A gnome shell extension. Provides seperate menu for power options. The old hybrid sleep may not function properly. Try the new hybrid sleep which is actually suspend-then-hibernate. To use `Hibernate` [manually enable][1] it.

### To install any extension
1. unzip the zip file
1. copy UUID from metadata.json inside folder
1. rename extracted folder by the UUID
1. makedir ~/.local/share/gnome-shell/extensions if not already exist
1. move/copy the renamed folder to ~/.local/share/gnome-shell/extensions
1. logout and then login again
1. install your prefered extension manager gnome-shell-extension-prefs or gnome-tweaks
1. Start your extension manager, find the extension and enable it.

Note: some codes are copied from [Hibernate Status Button][2] while others from [gnome shell 3.28][3]

To manually enable Hibernate option copy `UUID` of swap partition from `/etc/fstab` and edit `/etc/default/grub` to include `GRUB_CMDLINE_LINUX="`whatever there was before` resume=UUID=`YOUR_SWAP_UUID`"`

[1]: https://askubuntu.com/questions/1034185/ubuntu-18-04-cant-resume-after-hibernate/1064114#1064114
[2]: https://github.com/arelange/gnome-shell-extension-hibernate-status
[3]: https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/gnome-3-28/js/ui/status/system.js#L230
