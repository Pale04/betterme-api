package dataAccess

import (
	logger "MultimediaService/loggingService"
	m "MultimediaService/service/models"
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	database     = "betterMe"
	dbCollection = "post"
	dbHost       = ""
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

	coll := client.Database(database).Collection(dbCollection)

	var post m.Post
	err = coll.FindOne(context.TODO(), bson.E{Key: "_id", Value: id}).Decode(&post)

	if err == mongo.ErrNoDocuments {
		return m.Post{}, err
	}

	if err != nil {
		logger.Error(err)
		return m.Post{}, err
	}

	return post, nil
}

func WritePost(post m.Post) (m.Post, error) {
	if !post.IsValid() {
		logger.ErrorString("Tried to save an invalid post")
		return m.Post{}, fmt.Errorf("Tried to save an invalid post")
	}

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

	coll := client.Database(database).Collection(dbCollection)
	result, err := coll.InsertOne(context.TODO(), post)

	if err != nil {
		logger.Error(err)
		return m.Post{}, err
	}

	post.Id = result.InsertedID.(primitive.ObjectID).Hex()

	return post, nil
}
