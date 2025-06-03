package main

import (
	logger "MultimediaService/loggingService"
	pb "MultimediaService/proto"
	da "MultimediaService/service/dataAccess"
	"bufio"
	"context"
	"io"
)

func streamMultimedia(file da.FileData, id string, stream pb.MultimediaService_GetPostMultimediaServer) error {
	reader := bufio.NewReader(&file.Contents)
	buffer := make([]byte, 1024)

	for {
		n, err := reader.Read(buffer)

		if err == io.EOF {
			break
		}
		if err != nil {
			logger.Error(err)
			return err
		}

		err = stream.Send(&pb.FileChunk{
			Chunk:      buffer[:n],
			ResourceId: id,
		})

		if err != nil {
			logger.Error(err)
			return err
		}
	}

	return nil
}

func (s *server) GetPostMultimedia(post *pb.PostInfo, stream pb.MultimediaService_GetPostMultimediaServer) error {
	file, err := da.GetFile(post.Id, da.Post)

	if err != nil {
		logger.Error(err)
		return err
	}

	return streamMultimedia(file, post.Id, stream)
}

func (s *server) GetUserProfileImage(user *pb.UserInfo, stream pb.MultimediaService_GetUserProfileImageServer) error {
	file, err := da.GetFile(user.Id, da.User)

	if err != nil {
		logger.Error(err)
		return err
	}

	return streamMultimedia(file, user.Id, stream)
}

func (s *server) CreatePost(ctx context.Context, post *pb.Post) (*pb.Post, error) {
	return &pb.Post{}, nil
}

func (s *server) UploadPostMultimedia(stream pb.MultimediaService_UploadPostMultimediaServer) error {
	return nil
}
