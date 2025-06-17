package main

import (
	"log"
	"net"
	"os"

	pb "MultimediaService/proto"

	"github.com/joho/godotenv"
	"google.golang.org/grpc"
)

var (
	port = 6979
	ip   = "localhost"
)

type server struct {
	pb.UnimplementedMultimediaServiceServer
}

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
		return
	}

	lis, err := net.Listen("tcp", os.Getenv("GRPC_HOST"))

	if err != nil {
		log.Fatal("Error starting server: ", err)
		return
	}

	s := grpc.NewServer()
	pb.RegisterMultimediaServiceServer(s, &server{})

	log.Printf("server listening at %v", lis.Addr())

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
