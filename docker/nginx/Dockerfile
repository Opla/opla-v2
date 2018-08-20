FROM nginx:1.13

COPY ./backend/default.template /etc/nginx/conf.d/backend.template
COPY ./front/default.template /etc/nginx/conf.d/front.template
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

ENV DOLLAR $

CMD ["/bin/bash", "-c", "envsubst < /etc/nginx/conf.d/backend.template > /etc/nginx/conf.d/backend.conf && envsubst < /etc/nginx/conf.d/front.template > /etc/nginx/conf.d/front.conf && nginx -g 'daemon off;'"]
