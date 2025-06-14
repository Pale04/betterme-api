package test

import (
	da "MultimediaService/service/dataAccess"
	"MultimediaService/service/models"
	"MultimediaService/test/helpers"

	"os"
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func TestMain(m *testing.M) {
	setup()
	code := m.Run()
	shutdown()
	os.Exit(code)
}

func setup() {
	helpers.CleanDB()
}

func shutdown() {
	helpers.CleanDB()
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
		result.ID.Hex() == "" {
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
		return
	}

	if err.Error() != "Tried to save an invalid post" {
		t.Errorf("Expected invalid post error, returned: %s", err.Error())
	}
}

func TestGetPost(t *testing.T) {
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
		t.Errorf("Couldn't save post to mongodb, error ocurred: %s", err.Error())
		return
	}

	postId := result.ID
	t.Logf("Post id added: %s", postId.Hex())

	post, err = da.GetPost(postId)

	if err != nil {
		t.Errorf("Couldn't retrieve post info from mongodb, error ocurred: %s", err.Error())
	}

	if post.ID != postId {
		t.Errorf("Retrieved wrong post, post retrieved: %s", post.ID)
	}
}

func TestGetNonExistentPost(t *testing.T) {
	id, _ := bson.ObjectIDFromHex("684df2b209e9f1915427b7aa")
	_, err := da.GetPost(id)

	if err != mongo.ErrNoDocuments {
		t.Errorf("Expected document not found error, error found: %s", err.Error())
	}
}
