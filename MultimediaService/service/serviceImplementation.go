package main

import (
	logger "MultimediaService/loggingService"
	pb "MultimediaService/proto"
	da "MultimediaService/service/dataAccess"
	"MultimediaService/service/models"
	"bytes"
	"context"
	"io"
)

func streamMultimedia(file da.FileData, id string, stream pb.MultimediaService_GetPostMultimediaServer) error {
	reader := bytes.NewReader(file.Contents)
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
	postAdded, err := da.WritePost(models.Post{})

	if err != nil {
		logger.Error(err)
		return &pb.Post{}, err
	}

	newPost := postAdded.ToProto()

	return &newPost, nil
}

func (s *server) UploadPostMultimedia(stream pb.MultimediaService_UploadPostMultimediaServer) error {
	var buffer bytes.Buffer
	var resourceId string
	var ext string

	for {
		chunk, err := stream.Recv()

		if err == io.EOF {
			break
		}

		if err != nil {
			logger.Error(err)
			return err
		}

		ext = chunk.GetExt()
		resourceId = chunk.GetResourceId()
		_, err = buffer.Write(chunk.GetChunk())

		if err != nil {
			logger.Error(err)
			return err
		}
	}

	da.WriteFile(da.FileData{
		Contents: []byte{},
		Name:     "post" + resourceId + ext,
		Source:   da.Post,
	})

	return stream.SendAndClose(&pb.PostInfo{
		Id: resourceId,
	})
}

func (s *server) UploadProfileImage(stream pb.MultimediaService_UploadProfileImageServer) error {
	var buffer bytes.Buffer
	var resourceId string
	var ext string

	for {
		chunk, err := stream.Recv()

		if err == io.EOF {
			break
		}

		if err != nil {
			logger.Error(err)
			return err
		}

		ext = chunk.GetExt()
		resourceId = chunk.GetResourceId()
		_, err = buffer.Write(chunk.GetChunk())

		if err != nil {
			logger.Error(err)
			return err
		}
	}

	da.WriteFile(da.FileData{
		Contents: []byte{},
		Name:     "post" + resourceId + ext,
		Source:   da.User,
	})

	return stream.SendAndClose(&pb.UserInfo{
		Id: resourceId,
	})
}
