FROM cockroachdb/cockroach:beta-20161110

ENV CONTAINERPILOT_VER 2.4.2
ENV CONTAINERPILOT file:///etc/containerpilot.json

# By keeping a lot of discrete steps in a single RUN we can clean up after
# ourselves in the same layer. This is gross but it saves ~100MB in the image
RUN set -ex \
    # \
    # Add Nodejs
    # \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && export buildDeps='gcc unzip' \
    && export runDeps='nodejs curl libffi-dev libssl-dev ca-certificates' \
    && apt-get update \
    && apt-get install -y $buildDeps $runDeps --no-install-recommends \
    # \
    # Add Consul from https://releases.hashicorp.com/consul \
    # \
    && export CHECKSUM=b350591af10d7d23514ebaa0565638539900cdb3aaa048f077217c4c46653dd8 \
    && curl -Lvo /tmp/consul.zip https://releases.hashicorp.com/consul/0.7.0/consul_0.7.0_linux_amd64.zip \
    && echo "${CHECKSUM}  /tmp/consul.zip" | sha256sum -c \
    && unzip /tmp/consul.zip -d /usr/local/bin \
    && rm /tmp/consul.zip \
    && mkdir /config \
    # \
    # Add ContainerPilot and set its configuration file path \
    # \
    && export CONTAINERPILOT_CHECKSUM=61712373d52a5cfc5ae0d694477129604a52827c \
    && curl -Lvo /tmp/containerpilot.tar.gz "https://github.com/joyent/containerpilot/releases/download/${CONTAINERPILOT_VER}/containerpilot-${CONTAINERPILOT_VER}.tar.gz" \
    && echo "${CONTAINERPILOT_CHECKSUM}  /tmp/containerpilot.tar.gz" | sha1sum -c \
    && tar zxf /tmp/containerpilot.tar.gz -C /usr/local/bin \
    && rm /tmp/containerpilot.tar.gz \
    # \
    # clean up to minimize image layer size \
    # \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge -y --auto-remove $buildDeps

COPY etc/* /etc/
COPY start-or-join .
COPY bin .

# override the parent entrypoint
ENTRYPOINT []

# use --console to get error logs to stderr
CMD [ "containerpilot", "./start-cockroach" ]
