FROM nginx:1.13

COPY ./opla.template /etc/nginx/conf.d/opla.template
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

ENV DOLLAR $

CMD ["/bin/bash", "-c", "envsubst < /etc/nginx/conf.d/opla.template > /etc/nginx/conf.d/opla.conf && nginx -g 'daemon off;'"]
