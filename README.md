# hello express

Applicazione Node.js con web server Express che abbia due endpoint:
- Endpoint per creare un oggetto su S3
- Endpoint per recuperare un oggetto da S3


Il primo ("Creare oggetto su S3") serve che:
- Prenda del testo da un utente (in POST, o in GET passato come query string, indifferente per me)
- Generi due stringhe random (UUID tipo) che chiamiamo A e B
- Salvi questo file dell'utente su S3 con nome oggetto: A
- Salvi un record sul database di RDS in una table con 2 colonne dove la chiave primaria è A, il valore dell'altra colonna è B (colonna con nome tipo "s3ObjectName")

A quel punto al secondo endpoint ("Recuperare oggetto da S3") uno fa una chiamata in GET passando A, l'applicativo di Node chiama il DB e guarda il valore di B corrispondente ad A, recupera da S3 il file, legge i contenuti, restituisce all'utente il contenuto del file



Per il development usare un tunnel ssh:
```bash
ssh -L 3306:database-dmitri.cddrrdu3plsy.eu-north-1.rds.amazonaws.com:3306 ec2-user@13.49.0.119
```


