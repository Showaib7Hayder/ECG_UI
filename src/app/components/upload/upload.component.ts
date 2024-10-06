import { Component } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { SignalData, UploadFileService } from 'src/app/services/upload-file.service';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration, Legend } from 'chart.js';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],

})
export class UploadComponent {

  signalFiles: string[] = ['test_signal_1.npy','test_signal_2.npy', 'test_signal_3.npy', 'test_signal_4.npy'];


  public files: NgxFileDropEntry[] = [];
  fileName: string | undefined = '';
  shape: number[] | undefined = [];
  lastModified = 0;
  signalInfo : SignalData | null = null;
  errorMessage : string = '';
  chart : Chart | undefined;


  constructor(private http: HttpClient,private uploadService: UploadFileService) {}


  onChooseSignal(fileName: string): void{
  const filePath = `assets/${fileName}`;

  console.log('choosen file ', fileName);

  this.http.get(filePath, { responseType: 'blob' }).subscribe(
    (fileBlob) => {
      const file = new File([fileBlob], fileName);

      this.uploadService.uploadFile(file).subscribe(
        (response: SignalData) => {
          console.log('File uploaded successfully:', response);
          this.uploadService.updateSignalData(response);

          // rendering the signal data to the Chart function to be processed
          this.renderChart(response.signal);
        },
        (error) => {
          console.error('Error uploading file:', error);

        }
      );
    },
    (error) => {
      console.error('Error fetching file:', error);
    }
  );

  }

  renderChart(signalData: number[][]): void {
    const ctx = document.getElementById('signalChart') as HTMLCanvasElement;

    const data = signalData.map((point, index) => ({
      x: index,
      y: point[0],
    }));

    const totalDuration = 10000;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx: any) => ctx.index === 0
      ? ctx.chart.scales.y.getPixelForValue(100)
      : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

    const animation = {
      x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN,
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
      onComplete: () => {
        setTimeout(() => {
          if (this.chart) {
            this.chart.data.datasets[0].data = [];
            this.chart.update('none');
            this.chart.data.datasets[0].data = data;
            this.chart.update();
          }
        }, 1000);
      }
    };




    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        datasets: [{
          borderColor: '#FF6384',
          borderWidth: 1,
          pointRadius: 0,
          data: data,
        }]
      },
      options: {
        animation: animation,
        interaction: {
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'linear'
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, config);
  }


  ngOnInit() {
    this.uploadService.getSignalData().subscribe((result) => {
      this.signalInfo = result;
      this.fileName = result?.filename;
      this.shape = result?.shape;

    });
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the file path
          console.log(droppedFile.relativePath, file);

          // saving the file as Observable with Behavior Subject
          this.uploadService.saveFileData(file);

          // uploading the file :

          if (file.name.endsWith('.npy')) {
            this.uploadFile(file);
          } else {
            this.errorMessage = 'Please upload a .npy file.';
          }

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  private uploadFile(file: File) {
    this.uploadService.uploadFile(file).subscribe(
      (response) => {
        this.uploadService.updateSignalData(response);
        this.errorMessage = '';
      },
      (error) => {
        console.error('Upload error:', error);
        this.errorMessage = 'An error occurred during file upload.';
      }
    );
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }
}
