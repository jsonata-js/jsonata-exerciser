# Build docker image
docker build -t jsonata-exerciser:v1 -f Dockerfile .

# Run docker image
docker run -p 3000:3000 jsonata-exerciser:v1