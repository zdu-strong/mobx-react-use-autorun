FROM rockylinux/rockylinux:9.7.20251123 AS first_docker

LABEL maintainer="zdu.strong@gmail.com"

# support utf-8
RUN dnf install -y langpacks-en glibc-langpack-en
ENV LANG="en_US.UTF-8"

# install nodejs
RUN dnf module install -y nodejs:24

# run test
FROM first_docker AS second_docker
RUN dnf install -y git
COPY . /all-code
RUN rm -rf /all-code/node_modules
WORKDIR /all-code
RUN npm test
RUN npm run build

# start server
ENTRYPOINT ["/bin/bash"]
