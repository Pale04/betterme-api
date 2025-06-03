package logger

import (
	"fmt"
	"log"
	"os"
)

const LogFileName = "logs/log.log"

func Error(logErr error) {
	logFile, err := os.OpenFile(LogFileName, os.O_APPEND|os.O_RDWR|os.O_CREATE, 0644)

	if err != nil {
		log.Panic(err)
	}

	defer logFile.Close()

	log.SetOutput(logFile)
	log.SetFlags(log.LstdFlags)
	log.Println(fmt.Errorf("ERROR occurred: %s", logErr))
}
