package models

import (
	pb "MultimediaService/proto"
)

type Post struct {
	Id          string
	Title       string
	Description string
	Category    string
	UserId      string
}

func (p Post) ToProto() pb.Post {
	return pb.Post{
		Id:          p.Id,
		Title:       p.Title,
		Description: p.Description,
		Category:    p.Category,
		UserId:      p.UserId,
	}
}

func (Post) FromProto(p *pb.Post, id string) Post {
	return Post{
		Id:          p.Id,
		Title:       p.Title,
		Description: p.Description,
		Category:    p.Category,
		UserId:      p.UserId,
	}
}
