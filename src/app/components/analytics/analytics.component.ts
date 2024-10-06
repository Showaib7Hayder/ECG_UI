import { Component } from '@angular/core';
import { UploadFileService, SignalData } from 'src/app/services/upload-file.service';
import { ChartType, ChartConfiguration } from 'chart.js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent {

  signalData$: Observable<SignalData | null>;


  constructor(private uploadFileService: UploadFileService) {
    this.signalData$ = this.uploadFileService.getSignalData();
  }

  ngOnInit() {
    this.signalData$.subscribe((data) => {
      if (data) {
        this.updateChart(data.signal);
      }
    });
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'ECG Signal',
        borderColor: '#42A5F5',
        fill: false,
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };

  public lineChartType: ChartType = 'line';

    updateChart(signal: number[][]) {
      this.lineChartData.labels = Array.from({ length: signal.length }, (_, i) => i.toString());
      this.lineChartData.datasets[0].data = signal.map(arr => arr[0]); // Plot the first channel
    }

  }






