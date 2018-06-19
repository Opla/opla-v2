INSERT INTO `applications` 
    (`id`,`idx`,`name`,`email`,`redirect_uri`,`grant_type`,`creation_date`,`secret`)
VALUES (
        unhex(replace(uuid(),'-','')),
        '{{ .Values.auth.clientId }}',
        'Opla Front',
        'opla@example.org',
        'http://127.0.0.1:8080',
        'password',
        '2018-05-25 00:04:46.968',
        '{{ .Values.auth.secret }}'
    );