/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ChartConfig } from 'app/types/ChartConfig';
import { FONT_FAMILY } from 'styles/StyleConstants';

const config: ChartConfig = {
  datas: [
    {
      label: 'mixed',
      key: 'mixed',
      required: true,
      type: 'mixed',
    },
    {
      label: 'filter',
      key: 'filter',
      type: 'filter',
      disableAggregate: true,
    },
  ],
  styles: [
    {
      label: 'header.title',
      key: 'header',
      comType: 'group',
      rows: [
        {
          label: 'header.open',
          key: 'modal',
          comType: 'group',
          options: { type: 'modal', modalSize: 'middle' },
          rows: [
            {
              label: 'header.styleAndGroup',
              key: 'tableHeaders',
              comType: 'tableHeader',
            },
          ],
        },
      ],
    },
    {
      label: 'column.conditionStyle',
      key: 'column',
      comType: 'group',
      rows: [
        {
          label: 'column.open',
          key: 'modal',
          comType: 'group',
          options: { type: 'modal', modalSize: 'middle' },
          rows: [
            {
              label: 'column.list',
              key: 'list',
              comType: 'listTemplate',
              rows: [],
              options: {
                getItems: cols => {
                  const columns = (cols || [])
                    .filter(col =>
                      ['aggregate', 'group', 'mixed'].includes(col.type),
                    )
                    .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                    .map(c => ({
                      key: c.uid,
                      value: c.uid,
                      type: c.type,
                      label:
                        c.label || c.aggregate
                          ? `${c.aggregate}(${c.colName})`
                          : c.colName,
                    }));
                  return columns;
                },
              },
              template: {
                label: 'column.listItem',
                key: 'listItem',
                comType: 'group',
                rows: [
                  {
                    label: 'column.columnStyle',
                    key: 'columnStyle',
                    comType: 'group',
                    options: { expand: true },
                    rows: [
                      {
                        label: 'column.useColumnWidth',
                        key: 'useColumnWidth',
                        default: false,
                        comType: 'checkbox',
                      },
                      {
                        label: 'column.columnWidth',
                        key: 'columnWidth',
                        default: 100,
                        options: {
                          min: 0,
                        },
                        /*watcher: {
                          deps: ['useColumnWidth'],
                          action: props => {
                            return {
                              disabled: !props.useColumnWidth,
                            };
                          },
                        },*/
                        comType: 'inputNumber',
                      },
                    ],
                  },
                  {
                    label: 'column.conditionStyle',
                    key: 'conditionStyle',
                    comType: 'group',
                    options: { expand: true },
                    rows: [
                      {
                        label: 'column.conditionStylePanel',
                        key: 'conditionStylePanel',
                        comType: 'conditionStylePanel',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      label: 'style.title',
      key: 'style',
      comType: 'group',
      rows: [
        {
          label: 'style.enableFixedHeader',
          key: 'enableFixedHeader',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'style.enableBorder',
          key: 'enableBorder',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'style.enableRowNumber',
          key: 'enableRowNumber',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'style.leftFixedColumns',
          key: 'leftFixedColumns',
          default: 0,
          options: {
            min: 0,
          },
          comType: 'inputNumber',
        },
        {
          label: 'style.rightFixedColumns',
          key: 'rightFixedColumns',
          default: 0,
          options: {
            min: 0,
          },
          comType: 'inputNumber',
        },
        {
          label: 'style.autoMergeFields',
          key: 'autoMergeFields',
          comType: 'select',
          options: {
            mode: 'multiple',
            getItems: cols => {
              const columns = (cols || [])
                .filter(col => ['mixed'].includes(col.type))
                .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                .filter(c => c.type === 'STRING')
                .map(c => ({
                  key: c.uid,
                  value: c.uid,
                  label:
                    c.label || c.aggregate
                      ? `${c.aggregate}(${c.colName})`
                      : c.colName,
                }));
              return columns;
            },
          },
        },
        {
          label: 'style.tableSize',
          key: 'tableSize',
          default: 'small',
          comType: 'select',
          options: {
            translateItemLabel: true,
            items: [
              { label: 'tableSize.default', value: 'default' },
              { label: 'tableSize.middle', value: 'middle' },
              { label: 'tableSize.small', value: 'small' },
            ],
          },
        },
      ],
    },
    {
      label: 'style.tableHeaderStyle',
      key: 'tableHeaderStyle',
      comType: 'group',
      rows: [
        {
          label: 'style.bgColor',
          key: 'bgColor',
          default: '#f8f9fa',
          comType: 'fontColor',
        },
        {
          label: 'style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: FONT_FAMILY,
            fontSize: 12,
            fontWeight: 'bold',
            fontStyle: 'normal',
            color: '#495057',
          },
        },
        {
          label: 'style.align',
          key: 'align',
          default: 'left',
          comType: 'fontAlignment',
        },
      ],
    },
    {
      label: 'style.tableBodyStyle',
      key: 'tableBodyStyle',
      comType: 'group',
      rows: [
        {
          label: 'style.oddFontColor',
          key: 'oddFontColor',
          default: '#000',
          comType: 'fontColor',
        },
        {
          label: 'style.oddBgColor',
          key: 'oddBgColor',
          default: 'rgba(0,0,0,0)',
          comType: 'fontColor',
        },
        {
          label: 'style.evenFontColor',
          key: 'evenFontColor',
          default: '#000',
          comType: 'fontColor',
        },
        {
          label: 'style.evenBgColor',
          key: 'evenBgColor',
          default: 'rgba(0,0,0,0)',
          comType: 'fontColor',
        },
        {
          label: 'style.fontSize',
          key: 'fontSize',
          comType: 'fontSize',
          default: 12,
        },
        {
          label: 'style.fontFamily',
          key: 'fontFamily',
          comType: 'fontFamily',
          default: FONT_FAMILY,
        },
        {
          label: 'style.fontWeight',
          key: 'fontWeight',
          comType: 'select',
          default: 'normal',
          options: {
            items: [
              { label: '常规字号', value: 'normal' },
              { label: '粗体', value: 'bold' },
              { label: '特粗体', value: 'bolder' },
              { label: '细体', value: 'lighter' },
              { label: '100', value: '100' },
              { label: '200', value: '200' },
              { label: '300', value: '300' },
              { label: '400', value: '400' },
              { label: '500', value: '500' },
              { label: '600', value: '600' },
              { label: '700', value: '700' },
              { label: '800', value: '800' },
              { label: '900', value: '900' },
            ],
          },
        },
        {
          label: 'style.fontStyle',
          key: 'fontStyle',
          comType: 'select',
          default: 'normal',
          options: {
            items: [
              { label: '常规体', value: 'normal' },
              { label: '斜体', value: 'italic' },
              { label: '偏斜体', value: 'oblique' },
            ],
          },
        },
        {
          label: 'style.align',
          key: 'align',
          default: 'left',
          comType: 'fontAlignment',
        },
      ],
    },
  ],
  settings: [
    {
      label: 'paging.title',
      key: 'paging',
      comType: 'group',
      rows: [
        {
          label: 'paging.enablePaging',
          key: 'enablePaging',
          default: true,
          comType: 'checkbox',
          options: {
            needRefresh: true,
          },
        },
        {
          label: 'paging.pageSize',
          key: 'pageSize',
          default: 100,
          comType: 'inputNumber',
          options: {
            needRefresh: true,
            step: 1,
            min: 0,
          },
          watcher: {
            deps: ['enablePaging'],
            action: props => {
              return {
                disabled: !props.enablePaging,
              };
            },
          },
        },
      ],
    },
    {
      label: 'summary.title',
      key: 'summary',
      comType: 'group',
      rows: [
        {
          label: 'summary.aggregateFields',
          key: 'aggregateFields',
          comType: 'select',
          options: {
            mode: 'multiple',
            getItems: cols => {
              const columns = (cols || [])
                .filter(col => ['mixed'].includes(col.type))
                .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                .filter(c => c.type === 'NUMERIC')
                .map(c => ({
                  key: c.uid,
                  value: c.uid,
                  label:
                    c.label || c.aggregate
                      ? `${c.aggregate}(${c.colName})`
                      : c.colName,
                }));
              return columns;
            },
          },
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        header: {
          title: '表头分组',
          open: '打开',
          styleAndGroup: '表头分组',
        },
        column: {
          open: '打开样式设置',
          list: '字段列表',
          sortAndFilter: '排序与过滤',
          enableSort: '开启列排序',
          basicStyle: '基础样式',
          useColumnWidth: '启用固定列宽',
          columnWidth: '列宽',
          columnStyle: '列样式',
          columnStylePanel: '列样式配置器',
          conditionStyle: '条件样式',
          conditionStylePanel: '条件样式配置器',
          backgroundColor: '背景颜色',
          align: '对齐方式',
          enableFixedCol: '开启固定列宽',
          fixedColWidth: '固定列宽度设置',
          font: '字体与样式',
        },
        style: {
          title: '表格样式',
          enableFixedHeader: '固定表头',
          enableBorder: '显示边框',
          enableRowNumber: '启用行号',
          leftFixedColumns: '左侧固定列',
          rightFixedColumns: '右侧固定列',
          autoMergeFields: '自动合并列内容',
          tableSize: '表格大小',
          tableHeaderStyle: '表头样式',
          tableBodyStyle: '表体样式',
          bgColor: '背景颜色',
          font: '字体',
          align: '对齐方式',
          fontWeight: '字体粗细',
          fontFamily: '字体',
          oddBgColor: '奇行背景色',
          oddFontColor: '奇行字体色',
          evenBgColor: '偶行背景色',
          evenFontColor: '偶行字体色',
          fontSize: '字体大小',
          fontStyle: '字体样式',
        },
        tableSize: {
          default: '默认',
          middle: '中',
          small: '小',
        },
        summary: {
          title: '数据汇总',
          aggregateFields: '汇总列',
        },
        paging: {
          title: '常规',
          enablePaging: '启用分页',
          pageSize: '每页行数',
        },
      },
    },
    {
      lang: 'en-US',
      translation: {
        header: {
          title: 'Table Header Group',
          open: 'Open',
          styleAndGroup: 'Header Group',
        },
        column: {
          open: 'Open Style Setting',
          list: 'Field List',
          sortAndFilter: 'Sort and Filter',
          enableSort: 'Enable Sort',
          basicStyle: 'Baisc Style',
          useColumnWidth: 'Use Column Width',
          columnWidth: 'Column Width',
          columnStyle: 'Column Style',
          columnStylePanel: 'Column Style Panel',
          conditionStyle: 'Condition Style',
          conditionStylePanel: 'Condition Style Panel',
          backgroundColor: 'Background Color',
          align: 'Align',
          enableFixedCol: 'Enable Fixed Column',
          fixedColWidth: 'Fixed Column Width',
          font: 'Font and Style',
        },
        style: {
          title: 'Table Style',
          enableFixedHeader: 'Enable Fixed Header',
          enableBorder: 'Show Border',
          enableRowNumber: 'Enable Row Number',
          leftFixedColumns: 'Left Fixed Columns',
          rightFixedColumns: 'Right Fixed Columns',
          autoMergeFields: 'Auto Merge Column Content',
          tableSize: 'Table Size',
          tableHeaderStyle: 'Table Header Style',
          tableBodyStyle: 'Table Body Style',
          bgColor: 'Background Color',
          font: 'Font',
          align: 'Align',
          fontWeight: 'Font Weight',
          fontFamily: 'Font Family',
          oddBgColor: 'Odd Row Background Color',
          evenBgColor: 'Even Row Background Color',
          oddFontColor: 'Odd Row Font Color',
          evenFontColor: 'Even Row Font Color',
          fontSize: 'Font Size',
          fontStyle: 'Font Style',
        },
        tableSize: {
          default: 'Default',
          middle: 'Middle',
          small: 'Small',
        },
        summary: {
          title: 'Summary',
          aggregateFields: 'Summary Fields',
        },
        paging: {
          title: 'Paging',
          enablePaging: 'Enable Paging',
          pageSize: 'Page Size',
        },
      },
    },
  ],
};

export default config;
