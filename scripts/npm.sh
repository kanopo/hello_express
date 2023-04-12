#!/bin/sh

# Install pnpm because i cant run npm install with an absolute path
# curl -fsSL https://get.pnpm.io/install.sh | sh -
# source ~/.bashrc

# pnpm install /var/www/html/node_app/hello_express/backend
# pnpm run build /var/www/html/node_app/hello_express/backend

# cd /var/www/html/node_app/
# npm install
# npm run build

# ln -s /var/www/html/efs/.env /var/www/html/node_app/.env
aws ssm get-parameter --name "dmitri-parameters-cifrato" --with-decryption --query "Parameter.Value" | sed -e 's/\\n/\n/g' -e 's/\\"/"/g' -e 's/^"//' -e 's/"$//' > /var/www/html/node_app/.env
sudo chown -R ec2-user:nginx /var/www/html/node_app

