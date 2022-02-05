# Power Menu
A gnome shell extension. Provides seperate menu for power options. To use `Hibernate` [manually enable][1] it.

### To install any extension
1. unzip the zip file
1. copy UUID from metadata.json inside folder
1. rename extracted folder by the UUID
1. makedir ~/.local/share/gnome-shell/extensions if not already exist
1. move/copy the renamed folder to ~/.local/share/gnome-shell/extensions
1. logout and then login again
1. install your prefered extension manager gnome-shell-extension-prefs or gnome-tweaks
1. Start your extension manager, find the extension and enable it.

Note: some codes are copied from [Hibernate Status Button][2]

To manually enable Hibernate option copy `UUID` of swap partition from `/etc/fstab` and edit `/etc/default/grub` to include `GRUB_CMDLINE_LINUX="`whatever there was before` resume=UUID=`YOUR_SWAP_UUID`"`

## To prevent grub from record fail: [Solution][3]
### /etc/systemd/system/MYCUSTOM.service
```
[Unit]
Description=Unset recordfail in grubenv after hibernation.
After=hibernate.target

[Service]
Type=oneshot
ExecStart=/usr/bin/grub-editenv /boot/grub/grubenv unset recordfail

[Install]
WantedBy=hibernate.target hybrid-sleep.target
```
Next enable this (^) service
```
sudo systemctl start MYCUSTOM.service
sudo systemctl stop MYCUSTOM.service
sudo systemctl enable MYCUSTOM.service
```
## To permit hibernation in PolicyKit
### /etc/polkit-1/localauthority/10-vendor.d/com.ubuntu.desktop.pkla
```
[Enable hibernate in upower]
Identity=unix-user:*
Action=org.freedesktop.upower.hibernate
ResultActive=yes

[Enable hibernate in logind]
Identity=unix-user:*
Action=org.freedesktop.login1.hibernate;org.freedesktop.login1.handle-hibernate-key;org.freedesktop.login1;org.freedesktop.login1.hibernate-multiple-sessions;org.freedesktop.login1.hibernate-ignore-inhibit
ResultActive=yes
```

[1]: https://askubuntu.com/questions/1034185/ubuntu-18-04-cant-resume-after-hibernate/1064114#1064114
[2]: https://github.com/arelange/gnome-shell-extension-hibernate-status
[3]: https://askubuntu.com/questions/1090266/grub-alternating-between-configurations/1094345#1094345
