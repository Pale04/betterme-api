package models

import (
	pb "MultimediaService/proto"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	ts "google.golang.org/protobuf/types/known/timestamppb"
)

type Post struct {
	ID                  bson.ObjectID `bson:"_id,omitempty"`
	Title               string        `bson:"title"`
	Description         string        `bson:"description"`
	Category            string        `bson:"category"`
	UserId              string        `bson:"userId"`
	TimeStamp           time.Time     `bson:"timeStamp"`
	Status              string        `bson:"status"`
	MultimediaExtension string        `bson:"multExtension"`
}

func (p *Post) ToProto() pb.Post {
	return pb.Post{
		Id:                  p.ID.Hex(),
		Title:               p.Title,
		Description:         p.Description,
		Category:            p.Category,
		UserId:              p.UserId,
		TimeStamp:           ts.New(p.TimeStamp),
		Status:              p.Status,
		MultimediaExtension: p.MultimediaExtension,
	}
}

func (Post) FromProto(p *pb.Post, id string) Post {
	objId, _ := bson.ObjectIDFromHex(p.Id)

	return Post{
		ID:                  objId,
		Title:               p.Title,
		Description:         p.Description,
		Category:            p.Category,
		UserId:              p.UserId,
		TimeStamp:           p.TimeStamp.AsTime(),
		Status:              p.Status,
		MultimediaExtension: p.MultimediaExtension,
	}
}

func (p *Post) IsValid() bool {
	return p.Title != "" &&
		p.Description != "" &&
		p.Category != "" &&
		p.UserId != "" &&
		// p.TimeStamp.Before(time.Now()) &&
		p.Status != ""
}
