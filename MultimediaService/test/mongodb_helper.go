package test

import (
	logger "MultimediaService/loggingService"
	"context"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	database     = "betterMe"
	dbCollection = "post"
	dbHost       = ""
)

func cleanDB() {
	client, err := mongo.Connect(options.Client().ApplyURI(dbHost))

	if err != nil {
		logger.ErrorString("Error while testing. See next entry")
		logger.Error(err)
		return
	}

	coll := client.Database(database).Collection(dbCollection)
	coll.DeleteMany(context.TODO(), bson.E{})
}
