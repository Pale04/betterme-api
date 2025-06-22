package dataAccess

import (
	logger "MultimediaService/loggingService"
	"bytes"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"path/filepath"
)

const path = "./images/"

type ImageSource int64

const (
	User = iota
	Post
)

type FileData struct {
	Contents []byte
	Name     string
	Source   ImageSource
}

func getImage(fileName string, fileSource ImageSource) (FileData, error) {
	var pathExt string
	switch fileSource {
	case User:
		pathExt = "users/"
	case Post:
		pathExt = "posts/"
	}

	file, err := os.Open(path + pathExt + fileName)
	defer file.Close()

	if err != nil {
		logger.Error(err)
		return FileData{}, err
	}

	var buffer []byte
	file.Read(buffer)

	return FileData{buffer, fileName, fileSource}, nil
}

func getVideo(fileName string) (FileData, error) {
	panic("unimplemented")
}

func GetFile(fileName string, fileSource ImageSource) (FileData, error) {
	var pathExt string
	switch fileSource {
	case User:
		pathExt = "users/"
	case Post:
		pathExt = "posts/"
	}
	// look for post<ID>.<anything>
	pattern := path + pathExt + "post" + fileName + ".*"
	matches, err := filepath.Glob(pattern)
	if err != nil || len(matches) == 0 {
		return FileData{}, fmt.Errorf("no file for %s (tried %q)", fileName, pattern)
	}
	realPath := matches[0]
	bts, err := os.ReadFile(realPath)
	if err != nil {
		return FileData{}, err
	}
	return FileData{
		Contents: bts,
		Name:     filepath.Base(realPath),
		Source:   fileSource,
	}, nil
}

func WriteFile(file FileData) error {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		if os.Mkdir(path, 0777) != nil {
			logger.Error(err)
			return err
		}

		if os.Mkdir(path+"users/", 0777) != nil {
			logger.Error(err)
			return err
		}

		if os.Mkdir(path+"posts/", 0777) != nil {
			logger.Error(err)
			return err
		}
	}

	var pathExt string
	switch file.Source {
	case User:
		pathExt = "users/"
	case Post:
		pathExt = "posts/"
	}

	var buffer bytes.Buffer
	buffer.Write(file.Contents)
	img, _, err := image.Decode(&buffer)

	if err != nil {
		logger.Error(err)
		return err
	}

	out, _ := os.Create(path + pathExt + file.Name)
	defer out.Close()

	format := filepath.Ext(file.Name)

	switch format {
	case ".jpg", ".jpeg":
		err = jpeg.Encode(out, img, nil)
	case ".png":
		err = png.Encode(out, img)
	case ".mp4", ".AVI", ".MOV":
		panic("unimplemented")
	default:
		logger.Error(fmt.Errorf("Cannot write file. Unsupported file format %s", format))
		return errors.New("unsupported file format")
	}

	if err != nil {
		logger.Error(err)
		return err
	}

	return nil
}
