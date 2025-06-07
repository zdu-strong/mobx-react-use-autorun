FROM rockylinux/rockylinux:9.6.20250531 AS first_docker

LABEL maintainer="zdu.strong@gmail.com"

# support utf-8
RUN dnf install -y langpacks-en glibc-langpack-en
ENV LANG="en_US.UTF-8"

# install nodejs
RUN dnf module install -y nodejs:22

# run test
FROM first_docker AS second_docker
RUN dnf install -y git
COPY . /all_code
WORKDIR /all_code
RUN git add .
RUN git reset --hard
RUN rm -rf ./node_modules
RUN npm test
RUN npm run build

# start server
ENTRYPOINT ["/bin/bash"]
