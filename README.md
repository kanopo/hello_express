# hello express

Per il development usare un tunnel ssh:
```bash
ssh -L 3306:database-dmitri.cddrrdu3plsy.eu-north-1.rds.amazonaws.com:3306 ec2-user@13.49.0.119
```

Comando per prendere le stringhe usato come dotenv
```
aws ssm get-parameter --name "dmitri-parameters" --with-decryption
```
