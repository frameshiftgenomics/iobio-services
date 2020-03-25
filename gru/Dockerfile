# Ubuntu bionic base image
FROM ubuntu:18.04

# Update & upgrade packages
RUN apt-get update && \
    apt-get -y upgrade

# Install dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
    build-essential \
    uuid-dev \
    libgpgme-dev \
    squashfs-tools \
    libseccomp-dev \
    wget \
    curl \
    pkg-config \
    git \
    cryptsetup-bin \
    libssl-dev \
    tzdata \
    python-pip

# Set timezone (needed for singularity)
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install python packages
RUN pip install nltk

RUN python -m nltk.downloader -d /usr/share/nltk_data wordnet

# Install go
ENV GOLANG_VERSION 1.14

RUN curl -sSL https://dl.google.com/go/go${GOLANG_VERSION}.linux-amd64.tar.gz \
		| tar -v -C /usr/local -xz

ENV PATH /usr/local/go/bin:$PATH

# Install singularity
ENV SINGULARITY_VERSION=3.5.3

RUN wget -nv https://github.com/sylabs/singularity/releases/download/v${SINGULARITY_VERSION}/singularity-${SINGULARITY_VERSION}.tar.gz && \
    tar -xzf singularity-${SINGULARITY_VERSION}.tar.gz && \
    cd singularity && \
    ./mconfig && \
    make -C builddir && \
    make -C builddir install

# Add /app as a bind path so singularity containers can access /app/data
ENV SINGULARITY_BIND="/app"

# Install Node.js 12 LTS
ENV NODE_VERSION=12.x

RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - && \
    apt-get install -y nodejs

# We expect node binary to be named "node", but Ubuntu names it "nodejs", so we create a symbolic link
RUN ln -s /usr/bin/nodejs /usr/local/bin/node

# Simlink tools
ENV PATH /app/tool_bin:$PATH

# Clear apt cache to reduce image size
RUN rm -rf /var/lib/apt/lists/*

# Source code is in /app
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN ["npm", "install"]

# Copy source code
COPY . .

# Install additional dependencies
RUN ["make", "local_install"]

# Expose port 9001
EXPOSE 9001

# Run the app on port 9001
CMD ["node", "src/index.js"]
