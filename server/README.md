# E-commerce app - backend

The backend part of the e-commerce application.

## Requirements

- Docker ([Get Docker](https://www.docker.com/get-started/))

## Building the Docker Image

1. Navigate to the project directory where **Dockerfile** is located
2. Build the DOcker image by running the following command. Replace `your-image-name` with a name of your choice for the docker image.

```zsh
docker build -t {your-image-name} .
```

## Running the Docker Container

1. Run the DOcker container using the image you've just build.

```zsh
docker run -d -p {port}:3000 --name {your-container-name} {your-image-name}
```

This command runs the container in detached mode (-d), maps port 3000 of the container to port 3000 on your host machine (-p 3000:3000), and names the container your-container-name.
