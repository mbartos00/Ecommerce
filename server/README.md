# E-commerce app - backend

The backend part of the e-commerce application.

## Requirements

- Bun ([Get Bun](https://bun.sh/))
- Docker ([Get Docker](https://www.docker.com/get-started/))

## Building the Docker Image

1. Navigate to the project directory where **Dockerfile** is located
2. Build the DOcker image by running the following command. Replace `your-image-name` with a name of your choice for the docker image.

```zsh
docker build -t {your-image-name} .
```

## Running the Docker Container

1. Run the Docker container using the image you've just build.

```zsh
docker run -d -p {port}:3000 --name {your-container-name} {your-image-name}
```

This command runs the container in detached mode (-d), maps port 3000 of the container to port 3000 on your host machine (-p 3000:3000), and names the container your-container-name.

## Prisma setup

Create .env file in the top level directory.

Add new variable with connection string eg.

```
DATABASE_URL="mongodb+srv://mbiegan:J6eCNJW5CRyECMPa@HOST:PORT/DATABASE"
```

## Using prisma

#### Connecting to database and adding Prisma models to local Prisma schema

```zsh
bun prisma db pull
```

#### Pushing state of local Prisma schema file to database

<font color="red">
Warning: 
</font>
Don't use prisma migrate, it won't work with mongodb

```zsh
bun prisma db push
```

#### Studio

Opens gui that allows you to interact and manage data.
By default starts on port :5555

```zsh
bun prisma studio
```
