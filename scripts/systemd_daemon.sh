#!/bin/sh

echo '
[Unit]
Description=demone_node
After=network.target

[Service]
EnvironmentFile=/var/www/html/node_app/.env
Type=simple
User=ec2-user
ExecStart=/usr/bin/node /var/www/html/node_app/dist/main.js
Restart=always

[Install]
WantedBy=multi-user.target

' > /lib/systemd/system/node_app.service
systemctl daemon-reload

