package main

import (
	"fmt"
	"log"
	"net"

	pb "MultimediaService/proto"

	"google.golang.org/grpc"
)

var (
	port = 6970
	ip   = ""
)

type server struct {
	pb.UnimplementedMultimediaServiceServer
}

func main() {
	lis, err := net.Listen("tcp", fmt.Sprintf("%s:%d", ip, port))

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
