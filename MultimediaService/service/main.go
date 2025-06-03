package main

import (
	"flag"
	"fmt"
	"log"
	"net"

	pb "MultimediaService/proto"
	"google.golang.org/grpc"
)

var (
	port = flag.Int("port", 6970, "Server port")
)

type server struct {
	pb.UnimplementedMultimediaServiceServer
}

func main() {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))

	if err != nil {
		log.Fatal("Error starting server: ", err)
	}

	s := grpc.NewServer()
	pb.RegisterMultimediaServiceServer(s, &server{})

	log.Printf("server listening at %v", lis.Addr())

	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
