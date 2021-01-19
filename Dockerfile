FROM registry.etest.tf.cn/base/nginx:1.14

COPY ./ms-docker.zip /static/ecloud/
RUN mkdir /static/ecloud/ukf
RUN unzip /static/ecloud/ms-docker.zip -d /static/ecloud/ukf
RUN adduser -D -g cmb cmb && chown -R cmb:cmb /usr/local && chown -R cmb:cmb /var && \
    chown -R cmb:cmb /etc && chown -R cmb:cmb /run
 
USER cmb
COPY ./nginx.conf /etc/nginx/nginx.conf

#FROM registry.etest.tf.cn/base/tomcat
#ARG APP_NAME=videobank

#RUN rm -rf /usr/local/tomcat/webapps/&& mkdir -p /usr/local/tomcat/webapps/${APP_NAME}/
#COPY ./system-manage-docker.zip /tmp/
#RUN unzip /tmp/system-manage-docker.zip -d /usr/local/tomcat/webapps/${APP_NAME}/
