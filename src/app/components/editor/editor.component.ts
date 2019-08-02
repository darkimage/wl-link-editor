import { CategoryListComponent } from './../category-list/category-list.component';
import { ParsingStrategyError } from './../../classes/output-parsing-strategy';
import { ItemComponent } from './../item/item.component';
import { ItemCategory } from './../../classes/item-category-class';
import { Component, OnInit, Renderer2, QueryList, ViewChildren, ViewChild, Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList, CdkDragStart} from '@angular/cdk/drag-drop';
import { ItemData } from '../../classes/item-data-class';
import { NgScrollbar } from 'ngx-scrollbar';
import { itemEditEvent } from './../item/item.interfaces';
import {ExpansionState, DescriptionState} from '../toolbar/toolbar.component';
import { MatExpansionPanel } from '@angular/material';
import { Observable, BehaviorSubject } from 'rxjs';
import { DropContainerComponent } from '../drop-container/drop-container.component';

export enum LayoutStyle {
  columnLeft,
  columnRight,
  columnLeftRight
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  outData: Promise<Array<ItemCategory>>;
  inData: Promise<Array<ItemCategory>>;
  inputIds: String[];
  outputIds: String[];
  PanelLeftVisible: Boolean = true;
  PanelRightVisible: Boolean = true;
  _inputList: CategoryListComponent;
  _outputList: CategoryListComponent;
  @ViewChild('outDropContainer', {static: true}) outDropContainer: DropContainerComponent;
  @ViewChild('inDropContainer', {static: true}) inDropContainer: DropContainerComponent;
  @ViewChild('inputList', {static: false}) inputList: CategoryListComponent;
  @ViewChild('outputList', {static: false}) outputList: CategoryListComponent;

  constructor() {}

  ngOnInit() {
  }

  @Input() set layout(layout: LayoutStyle){
    this.PanelLeftVisible = layout === LayoutStyle.columnLeft || layout === LayoutStyle.columnLeftRight;
    this.PanelRightVisible = layout === LayoutStyle.columnRight || layout === LayoutStyle.columnLeftRight;
    // console.log(layout);
    // console.log(this.PanelLeftVisible);
  }

  outputProcessed(data: Promise<Array<ItemCategory>>) {
    this.outData = data;
    // this._outputList = this.outputList;
    // this.inputList.refresh();
  }

  inputProcessed(data: Promise<Array<ItemCategory>>) {
    this.inData = data;
    // this._inputList = this.inputList;
    // this.outputIds = this.outputList.ids;
  }

  log(ev) {
    console.log(ev);
  }

  resetDropContainerOut() {
    this.outDropContainer.reset();
  }

  resetDropContainerIn() {
    this.inDropContainer.reset();
  }
}
