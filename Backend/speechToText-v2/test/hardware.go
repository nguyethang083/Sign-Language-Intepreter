package main

import (
	"fmt"
	"time"

	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/mem"
)

func monitorPerformance(duration time.Duration) {
	for i := 0; i < int(duration.Seconds()); i++ {
		v, _ := mem.VirtualMemory()
		c, _ := cpu.Percent(0, false)
		fmt.Printf("CPU Usage: %.2f%%, Memory Usage: %.2f%%\n", c[0], v.UsedPercent)
		time.Sleep(1 * time.Second)
	}
}

func main() {
	fmt.Println("Monitoring system performance...")
	monitorPerformance(30 * time.Second) // Monitor trong 30 giây
}
