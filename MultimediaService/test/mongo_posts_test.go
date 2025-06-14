package test

import (
	logger "MultimediaService/loggingService"
	da "MultimediaService/service/dataAccess"
	"MultimediaService/service/models"
	"os"
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

var postId string

func TestMain(m *testing.M) {
	setup()
	code := m.Run()
	shutdown()
	os.Exit(code)
}

func setup() {
	cleanDB()

	post := models.Post{
		Title:       "maleficios del yoga",
		Description: "lorem ipsum dolor sit amet",
		Category:    "Workout",
		UserId:      "aieubd123",
		TimeStamp:   time.Now(),
		Status:      "Published",
	}

	result, err := da.WritePost(post)

	if err != nil {
		logger.ErrorString("Error while testing. See next entry")
		logger.Error(err)
		return
	}

	post.Id = result.Id
}

func shutdown() {
	cleanDB()
}

func TestCreatePost(t *testing.T) {
	post := models.Post{
		Title:       "beneficios del yoga",
		Description: "lorem ipsum dolor sit amet",
		Category:    "Workout",
		UserId:      "aieubd123",
		TimeStamp:   time.Now(),
		Status:      "Published",
	}

	result, err := da.WritePost(post)

	if err != nil {
		t.Errorf("Couldn't save post to mongodb, error ocurred: %s", err.Error())
	}

	if result.Title != "beneficios del yoga" ||
		result.Description != "lorem ipsum dolor sit amet" ||
		result.Id == "" {
		t.Errorf("Saved wrong post info: %s", result.Title)
	}
}

func TestCreateInvalidPost(t *testing.T) {
	post := models.Post{
		Title:       "",
		Description: "lorem ipsum dolor sit amet",
		Category:    "Workout",
		UserId:      "",
		TimeStamp:   time.Now(),
		Status:      "Published",
	}

	_, err := da.WritePost(post)

	if err == nil {
		t.Errorf("Expected invalid post error")
	}

	if err.Error() != "Tried to save an invalid post" {
		t.Errorf("Expected invalid post error, returned: %s", err.Error())
	}
}

func TestGetPost(t *testing.T) {
	post, err := da.GetPost(postId)

	if err != nil {
		t.Errorf("Couldn't retrieve post info from mongodb, error ocurred: %s", err.Error())
	}

	if post.Id != postId {
		t.Errorf("Retrieved wrong post, post retrieved: %s", post.Id)
	}
}

func TestGetNonExistentPost(t *testing.T) {
	_, err := da.GetPost("aaaaaaaa")

	if err != mongo.ErrNoDocuments {
		t.Errorf("Expected document not found error")
	}
}
