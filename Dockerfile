FROM oraclelinux:7.6

RUN mkdir -p /usr/lib/oracle/18.3/client64/lib/wallet

RUN yum install -y oracle-nodejs-release-el7 oracle-release-el7 && \
    yum -y install --disablerepo=ol7_developer_EPEL nodejs node-oracledb-node10 && \
    sh -c "echo /usr/lib/oracle/18.3/client64/lib > /etc/ld.so.conf.d/oracle-instantclient.conf" && \
    ldconfig

EXPOSE 4000
WORKDIR ./
ADD . ./
CMD TNS_ADMIN=/usr/lib/oracle/18.3/client64/lib/wallets; export TNS_ADMIN && \
    npm install && \
    node server.js