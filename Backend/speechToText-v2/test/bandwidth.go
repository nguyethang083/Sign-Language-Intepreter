package main

import (
	"fmt"
	"log"
	"os/exec"
	"time"
)

func measureBandwidth(peerCount int, duration time.Duration) {
	start := time.Now()
	cmd := exec.Command("bmon", "-p", "eth0", "-o", "format:plain") // Đo băng thông qua card mạng eth0
	output, err := cmd.Output()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Bandwidth for %d peers over %v: %s\n", peerCount, time.Since(start), string(output))
}

func main() {
	peerCounts := []int{2, 5, 10}
	for _, peer := range peerCounts {
		fmt.Printf("Testing with %d peers...\n", peer)
		measureBandwidth(peer, 10*time.Second)
	}
}
