FROM golang:1.23.0

WORKDIR /app

COPY go.mod go.sum ./
run go mod download

copy . ./

RUN CGO_ENABLED=0 GOOS=linux go build -o multimedia-service .

EXPOSE 6979

ENTRYPOINT ["./multimedia-service"]
