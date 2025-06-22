package dataAccess

import (
	logger "MultimediaService/loggingService"
	m "MultimediaService/service/models"
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	database     = "betterMeDB"
	dbCollection = "post"
)

func GetPost(id bson.ObjectID) (m.Post, error) {
	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
		return m.Post{}, err
	}

	client, err := mongo.Connect(options.Client().ApplyURI(os.Getenv("DATABASE_NAME")))

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

	err = coll.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&post)

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

	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
		return m.Post{}, err
	}

	client, err := mongo.Connect(options.Client().ApplyURI(os.Getenv("DATABASE_NAME")))

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

	post.ID = result.InsertedID.(bson.ObjectID)

	return post, nil
}
