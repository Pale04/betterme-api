package helpers

import (
	logger "MultimediaService/loggingService"
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	database     = "betterMe"
	dbCollection = "post"
)

func CleanDB() {
	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}

	client, err := mongo.Connect(options.Client().ApplyURI(os.Getenv("DATABASE_NAME")))

	if err != nil {
		logger.ErrorString("Error while testing. See next entry")
		logger.Error(err)
		return
	}

	coll := client.Database(database).Collection(dbCollection)
	coll.DeleteMany(context.TODO(), bson.E{})
}
