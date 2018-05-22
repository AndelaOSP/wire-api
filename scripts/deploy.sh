#!/bin/bash

set -eo pipefail

# Esablish important variables
DOCKER_REGISTRY=gcr.io
DEFAULT_GOOGLE_CLUSTER_PREFIX=bench
PROJECT_NAME=wire-backend

COMMIT_HASH=$(git rev-parse --short HEAD)

if [ "$CIRCLE_BRANCH" == 'master' ]; then
    IMAGE_TAG=$COMMIT_HASH
    ENVIRONMENT=production
    GOOGLE_COMPUTE_ZONE=europe-west1-b
else
    IMAGE_TAG="${CIRCLE_BRANCH}-${COMMIT_HASH}"
    ENVIRONMENT=staging
    GOOGLE_COMPUTE_ZONE=us-central1-a
fi

GOOGLE_CLUSTER_NAME="${DEFAULT_GOOGLE_CLUSTER_PREFIX}-${ENVIRONMENT}"
DEPLOYMENT_NAME="${ENVIRONMENT}-${PROJECT_NAME}"
IMAGE="${DOCKER_REGISTRY}/${GOOGLE_PROJECT_ID}/${PROJECT_NAME}:${IMAGE_TAG}"

install_google_cloud_sdk(){
    echo "====> Installing google cloud sdk"
    echo "deb http://packages.cloud.google.com/apt cloud-sdk-jessie main" | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
    sudo apt-get update && sudo apt-get install kubectl google-cloud-sdk
}

auth_with_service_account() {
    echo "====> Store Sand authenticate with service account"
    echo $GCLOUD_SERVICE_KEY | base64 --decode > ${HOME}/gcloud-service-key.json
    gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
}

configure_google_cloud_sdk() {
    echo "Configuring Google Cloud Sdk"
    gcloud auth activate-service-account --key-file=${HOME}/gcloud-service-key.json
    gcloud --quiet config set project ${GOOGLE_PROJECT_ID}
    gcloud --quiet config set compute/zone ${GOOGLE_COMPUTE_ZONE}
    gcloud --quiet container clusters get-credentials ${GOOGLE_CLUSTER_NAME}
}

login_to_docker_registry() {
    echo "====> Login to docker registry"
    docker login -u _json_key --password-stdin https://${DOCKER_REGISTRY} < ${HOME}/gcloud-service-key.json
}

logout_of_docker_registry() {
    echo "====> Logout from docker"
    docker logout https://${DOCKER_REGISTRY}
}

tag_and_publish_image() {
    docker build -t $IMAGE -f docker/release/Dockerfile .
    docker push $IMAGE
}

deploy_to_kubernetes() {
    # TODO: deploy built image to kubernetes cluster
    # gcr.io/bench-projects/wire-backend:
    echo "====> Prepare image for deployement"
    echo "====> Deploying ${IMAGE} to ${DEPLOYMENT_NAME} in ${ENVIRONMENT} environment"
    kubectl set image deployment/${DEPLOYMENT_NAME} backend=${IMAGE} -n ${ENVIRONMENT}

    if [ "$?" == "0" ]; then
        echo "Deployment completed succesfully"
        exit 0
    else
        echo "Failed to deploy ${IMAGE} to ${ENVIRONMENT} environment"
        exit 1
    fi
}

main () {
    install_google_cloud_sdk
    auth_with_service_account
    configure_google_cloud_sdk
    login_to_docker_registry
    tag_and_publish_image
    logout_of_docker_registry
    deploy_to_kubernetes
}

main
