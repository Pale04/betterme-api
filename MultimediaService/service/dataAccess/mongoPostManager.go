package dataAccess

import (
	logger "MultimediaService/loggingService"
	m "MultimediaService/service/models"
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func GetPost(id string) (m.Post, error) {
	client, err := mongo.Connect(options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		logger.Error(err)
		return m.Post{}, err
	}

	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			logger.Error(err)
		}
	}()

	coll := client.Database("betterMe").Collection("post")

	var post m.Post
	err = coll.FindOne(context.TODO(), bson.E{Key: "_id", Value: id}).Decode(&post)

	if err != nil {
		logger.Error(err)
		return m.Post{}, err
	}

	return post, nil
}

func WritePost(post m.Post) (m.Post, error) {
	client, err := mongo.Connect(options.Client().ApplyURI("mongodb://localhost:27017"))

	if err != nil {
		logger.Error(err)
		return m.Post{}, err
	}

	defer func() {
		if err = client.Disconnect(context.TODO()); err != nil {
			logger.Error(err)
		}
	}()

	coll := client.Database("betterMe").Collection("post")
	result, err := coll.InsertOne(context.TODO(), post)

	if err != nil {
		logger.Error(err)
		return m.Post{}, err
	}

	post.Id = result.InsertedID.(primitive.ObjectID).Hex()

	return post, nil
}
