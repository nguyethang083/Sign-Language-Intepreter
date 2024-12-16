package main

import (
	"fmt"
	"net/http"
	"time"
)

func pingMediaServer(url string) {
	start := time.Now()
	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("Error pinging media server: %v\n", err)
		return
	}
	defer resp.Body.Close()
	fmt.Printf("Latency to Media Server %s: %v\n", url, time.Since(start))
}

func main() {
	mediaServerURL := "http://your-media-server-address/ping"
	pingMediaServer(mediaServerURL)
}
