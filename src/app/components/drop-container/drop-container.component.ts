import { JekyllOutputStrategy } from './../../classes/jekyll-output';
import { OutputParsingStrategy } from './../../classes/output-parsing-strategy';
import { ElectronService } from './../../providers/electron.service';
import { FileProcessorService } from './../../services/file-processor.service';
import { Component, OnInit, HostListener, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ItemCategory } from '../../classes/item-category-class';
import { ItemData } from '../../classes/item-data-class';
import { Observable, BehaviorSubject } from 'rxjs';
import { InputParsingStrategy, ParsingStrategyError } from '../../classes/input-parsing-strategy';
import { MatDialog } from '@angular/material';
import { StrategyDialogComponent, DialogStrategyConfig } from '../strategy-dialog/strategy-dialog.component';

export type DropCantainerType = 'input' | 'output';

export interface DropContainerConfig { text: String; type: DropCantainerType; }

@Component({
  selector: 'app-drop-container',
  templateUrl: './drop-container.component.html',
  styleUrls: ['./drop-container.component.scss']
})
export class DropContainerComponent implements OnInit {
  hasDropped: Boolean = false;
  strategy: InputParsingStrategy;
  dataPromise: Promise<Array<ItemCategory>>;
  @Input() config: DropContainerConfig;
  @Input() dialogConfig: DialogStrategyConfig;
  @Output() processedData: EventEmitter<Promise<Array<ItemCategory>> | Promise<Array<ItemData>>> = new EventEmitter();
  @Output() exportStrategy: EventEmitter<InputParsingStrategy> =  new EventEmitter();
  // @ViewChild('container', {static: false}) contiener: ElementRef;/\
  constructor(
    private processor: FileProcessorService,
    private electron: ElectronService,
    private dialog: MatDialog,
    private fileService: FileProcessorService
    ) { }

  ngOnInit() {
  }

  getProcessPromise(files, strategy: OutputParsingStrategy){
    return new Promise<Array<ItemCategory>>((resolve, reject) => {
        const data = this.processor.getDataFromfiles(files);
        this.processor.processFile(data, strategy).then((res) => {
          resolve(res);
        }).catch((error: ParsingStrategyError) => {
          reject(error);
        });
      });
  }

  async onFileDropped(ev: Array<any>) {
    const choseDialog = this.dialog.open(StrategyDialogComponent, {
      width: this.dialogConfig.width as string,
      data: this.dialogConfig
    });

    choseDialog.afterClosed().subscribe(strategy => {
      if (strategy) {
        this.strategy = strategy;
        this.hasDropped = true;
        const promise  = this.getProcessPromise(ev, strategy);
        this.dataPromise = promise;
        this.processedData.next(promise);
      }
    });
  }

  reset() {
    this.hasDropped = false;
  }

  export() {
    if (this.strategy) {
      this.exportStrategy.emit(this.strategy);
    }
  }

}
