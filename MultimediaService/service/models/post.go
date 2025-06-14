package models

import (
	pb "MultimediaService/proto"
	ts "google.golang.org/protobuf/types/known/timestamppb"
	"time"
)

type Post struct {
	Id          string
	Title       string
	Description string
	Category    string
	UserId      string
	TimeStamp   time.Time
	Status      string
}

func (p *Post) ToProto() pb.Post {
	return pb.Post{
		Id:          p.Id,
		Title:       p.Title,
		Description: p.Description,
		Category:    p.Category,
		UserId:      p.UserId,
		TimeStamp:   ts.New(p.TimeStamp),
		Status:      p.Status,
	}
}

func (Post) FromProto(p *pb.Post, id string) Post {
	return Post{
		Id:          p.Id,
		Title:       p.Title,
		Description: p.Description,
		Category:    p.Category,
		UserId:      p.UserId,
		TimeStamp:   p.TimeStamp.AsTime(),
		Status:      p.Status,
	}
}

func (p *Post) IsValid() bool {
	return p.Title != "" ||
		p.Description != "" ||
		p.Category != "" ||
		p.UserId != "" ||
		p.TimeStamp.Before(time.Now()) ||
		p.Status != ""
}
