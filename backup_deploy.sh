#!/bin/sh
# Update ec2
yum update -y

# Enable nginx for yum
amazon-linux-extras enable nginx1

# Install php mysql server and mysql php integration
yum install -y nginx php72 mysql57-server php72-mysqlnd php-gd
# install 
amazon-linux-extras install -y lamp-mariadb10.2-php7.2 php7.2
# Enable nginx deamon and start
systemctl enable nginx
systemctl start nginx

# Allow ec2 user to set permissions
usermod -aG nginx ec2-user

mkdir -p /var/www/html/efs
chown ec2-user:nginx -R /var/www/html
chmod 2775 /var/www && find /var/www -type d -exec chmod 2775 {} \;

echo '
map $http_x_forwarded_proto $fastcgi_https {
  default off;
  http off;
  https on;
}

server {
      listen       80;
      server_name  wordpress.dmitri.sandbox.soluzionifutura.it;
      root         /var/www/html/efs/wordpress;
      index        index.html index.php; 

      # Load configuration files for the default server block.
      include /etc/nginx/default.d/*.conf;
}
' > /etc/nginx/conf.d/wordpress.conf 

echo '
server {
      listen       80;
      server_name  dmitri.sandbox.soluzionifutura.it;
      root         /var/www/html/efs/dmitri/;
      index        index.html; 

      # Load configuration files for the default server block.
      include /etc/nginx/default.d/*.conf;
}
' > /etc/nginx/conf.d/dmitri.conf

echo '

server {  
              listen 80;
              server_name nodebackend.dmitri.sandbox.soluzionifutura.it;
              location / {  
                           proxy_pass http://localhost:3000;  
                           proxy_http_version 1.1;  
                           proxy_set_header Upgrade $http_upgrade;  
                           proxy_set_header Connection 'upgrade';  
                           proxy_set_header Host $host;  
                           proxy_cache_bypass $http_upgrade;  
               }  
}
' > /etc/nginx/conf.d/node.conf 


echo '
index index.php index.html index.htm;

location ~ \.(php|phar)(/.*)?$ {
    fastcgi_split_path_info ^(.+\.(?:php|phar))(/.*)$;

    fastcgi_intercept_errors on;
    fastcgi_index  index.php;
    include        fastcgi_params;
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    fastcgi_param  PATH_INFO $fastcgi_path_info;
    fastcgi_param  HTTPS $fastcgi_https;
    fastcgi_pass   php-fpm;
}' | tee /etc/nginx/default.d/php.conf


echo "10.0.2.170:/    /var/www/html/efs/        nfs4    nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport 0   0"| tee -a /etc/fstab

mount -a


systemctl reload nginx.service
systemctl reload php-fpm.service

# AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

unzip awscliv2.zip
./aws/install

# cleanup
rm awscliv2.zip
rm -dfR aws/

# Add in aws command in path
echo "export PATH=$PATH:/usr/local/bin/aws
" | tee -a /home/ec2-user/.bashrc

# node setup 
curl -sL https://rpm.nodesource.com/setup_16.x | bash -
yum install -y nodejs


echo '
[Unit]
Description=demone_node
After=network.target

[Service]
EnvironmentFile=/var/www/html/efs/hello_express/backend/.env
Type=simple
User=ec2-user
ExecStart=/usr/bin/node /var/www/html/efs/hello_express/backend/dist/main.js
Restart=always

[Install]
WantedBy=multi-user.target

' | tee -a /lib/systemd/system/node_app.service
systectl daemon-reload
systemctl start node_app
systemctl enable node_app
systemctl restart node_app

yum install -y git
