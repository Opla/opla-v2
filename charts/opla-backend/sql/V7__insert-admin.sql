SET @password_md1sum = SHA1('password');

INSERT INTO `users` 
    (`id`,`idx`,`username`,`password`,`email`,`valid_email`,`creation_date`) 
VALUES 
    (unhex(replace(uuid(),'-','')),
    '{{ .Values.db.auth.userId }}',
    'admin',
    @password_md1sum,
    'qa@opla.ai',
    0,
    '2018-05-29 09:19:03.012');

INSERT INTO `authentications` 
    (`id`,`idx`,`user_id`,`client_id`,`scope`,`redirect_uri`) 
VALUES 
    (unhex(replace(uuid(),'-','')),
    '{{ .Values.db.auth.clientId }}-{{ .Values.db.auth.userId }}',
    '{{ .Values.db.auth.userId }}',
    '{{ .Values.db.auth.clientId }}',
    'admin',
    'localhost');

 INSERT INTO `bots` (`id`,`idx`,`name`,`email`,`author`,`creation_date`) 
 VALUES
    (unhex(replace(uuid(),'-','')),
    '{{ .Values.db.auth.botId }}',
    'My QA Assistant',
    'qa@opla.ai',
    'admin',
    '2018-05-29 09:19:03.030');

 INSERT INTO `botUsers`
    (`id`,`idx`,`botId`,`userId`,`email`,`username`,`role`) 
 VALUES 
    (
     unhex(replace(uuid(),'-','')),
     '{{ .Values.db.auth.botUserId }}',
     '{{ .Values.db.auth.botId }}',
     '{{ .Values.db.auth.userId }}',
     'qa@opla.ai',
     'admin',
     'owner'
    );
