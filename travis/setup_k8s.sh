#!/bin/bash
set -ev

openssl aes-256-cbc -K $encrypted_5791a711b578_key -iv $encrypted_5791a711b578_iv -in travis/credentials.tar.gz.enc -out credentials.tar.gz -d
tar -xzf credentials.tar.gz

#gcloud
export CLOUDSDK_CORE_DISABLE_PROMPTS=1
export CLOUDSDK_CORE_PROJECT=${GCLOUD_PROJECT_ID}
if [ ! -d ${HOME}/google-cloud-sdk ]; then
	curl https://sdk.cloud.google.com | bash
fi
mkdir -p lib
#Here we use the decrypted service account credentials to authenticate the command line tool
gcloud auth activate-service-account --key-file client-secret.json

#kubectl
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
gcloud container clusters get-credentials ${GCLOUD_CLUSTER_ID} --zone=${GCLOUD_CLUSTER_ZONE}

#helm
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get >get_helm.sh
chmod 700 get_helm.sh
sudo ./get_helm.sh
helm init --service-account tiller --upgrade

#myke
curl -LO https://github.com/goeuro/myke/releases/download/v1.0.0/myke_linux_amd64
chmod +x myke_linux_amd64
sudo mv myke_linux_amd64 /usr/local/bin/myke
myke --version
