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

const config: ChartConfig = {
  datas: [
    {
      label: 'dimension',
      key: 'dimension',
      required: true,
      limit: [1, 999],
      type: 'group',
    },
    {
      label: 'metrics',
      key: 'metrics',
      required: true,
      type: 'aggregate',
      limit: 1,
      actions: {
        NUMERIC: ['alias', 'sortable', 'format', 'aggregate'],
      },
    },
    {
      label: 'filter',
      key: 'filter',
      type: 'filter',
      allowSameField: true,
    },
    {
      label: 'info',
      key: 'info',
      type: 'info',
    },
  ],
  styles: [
    {
      label: 'treemap.title',
      key: 'treemap',
      comType: 'group',
      rows: [
        {
          label: 'common.width',
          key: 'width',
          default: '80%',
          comType: 'marginWidth',
        },
        {
          label: 'common.height',
          key: 'height',
          default: '80%',
          comType: 'marginWidth',
        },
        {
          label: 'treemap.focus',
          key: 'focus',
          comType: 'select',
          default: 'none',
          options: {
            items: [
              { label: '不淡出', value: 'none' },
              { label: '只聚焦', value: 'self' },
              { label: '聚焦父节点', value: 'ancestor' },
              { label: '聚焦子节点', value: 'descendant' },
            ],
          },
        },
        {
          label: 'treemap.leafDepth',
          key: 'leafDepth',
          default: 0,
          options: {
            min: 0,
          },
          comType: 'inputNumber',
        },
        {
          label: 'treemap.visibleMin',
          key: 'visibleMin',
          default: 300,
          options: {
            min: 0,
          },
          comType: 'inputNumber',
        },
      ],
    },
    {
      label: 'label.title',
      key: 'label',
      comType: 'group',
      rows: [
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.position',
          key: 'position',
          comType: 'select',
          default: 'insideTopLeft',
          options: {
            items: [
              { label: '上', value: 'top' },
              { label: '左', value: 'left' },
              { label: '右', value: 'right' },
              { label: '下', value: 'bottom' },
              { label: '内', value: 'inside' },
              { label: '内左', value: 'insideLeft' },
              { label: '内右', value: 'insideRight' },
              { label: '内上', value: 'insideTop' },
              { label: '内下', value: 'insideBottom' },
              { label: '内左上', value: 'insideTopLeft' },
              { label: '内左下', value: 'insideBottomLeft' },
              { label: '内右上', value: 'insideTopRight' },
              { label: '内右下', value: 'insideBottomRight' },
            ],
          },
        },
        {
          label: 'font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#495057',
          },
        },
      ],
    },
    {
      label: 'upperLabel.title',
      key: 'upperLabel',
      comType: 'group',
      rows: [
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.height',
          key: 'height',
          default: 30,
          comType: 'inputNumber',
        },
        {
          label: 'common.position',
          key: 'position',
          comType: 'select',
          default: 'insideLeft',
          options: {
            items: [
              { label: '上', value: 'top' },
              { label: '左', value: 'left' },
              { label: '右', value: 'right' },
              { label: '下', value: 'bottom' },
              { label: '内', value: 'inside' },
              { label: '内左', value: 'insideLeft' },
              { label: '内右', value: 'insideRight' },
              { label: '内上', value: 'insideTop' },
              { label: '内下', value: 'insideBottom' },
              { label: '内左上', value: 'insideTopLeft' },
              { label: '内左下', value: 'insideBottomLeft' },
              { label: '内右上', value: 'insideTopRight' },
              { label: '内右下', value: 'insideBottomRight' },
            ],
          },
        },
        {
          label: 'font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#495057',
          },
        },
      ],
    },
    {
      label: 'breadcrumb.title',
      key: 'breadcrumb',
      comType: 'group',
      rows: [
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.height',
          key: 'height',
          default: 22,
          options: {
            min: 0,
          },
          comType: 'inputNumber',
        },
        {
          label: 'breadcrumb.emptyItemWidth',
          key: 'emptyItemWidth',
          default: 22,
          options: {
            min: 16,
          },
          comType: 'inputNumber',
        },
        {
          label: 'common.position',
          key: 'position',
          comType: 'select',
          default: 'center,bottom',
          options: {
            items: [
              { label: '左上', value: 'left,top' },
              { label: '上', value: 'center,top' },
              { label: '右上', value: 'right,top' },
              { label: '左下', value: 'left,bottom' },
              { label: '下', value: 'center,bottom' },
              { label: '右下', value: 'right,bottom' },
            ],
          },
        },
        {
          label: 'font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#fff',
          },
        },
        {
          label: 'common.borderStyle',
          key: 'borderStyle',
          comType: 'line',
          default: {
            type: 'solid',
            width: 0,
            color: '#ced4da',
          },
        },
        {
          label: 'common.backgroundColor',
          key: 'backgroundColor',
          default: 'rgba(0,0,0,0.7)',
          comType: 'fontColor',
        },
      ],
    },
    {
      label: 'margin.title',
      key: 'margin',
      comType: 'group',
      rows: [
        {
          label: 'margin.left',
          key: 'marginLeft',
          default: '10%',
          comType: 'marginWidth',
        },
        {
          label: 'margin.top',
          key: 'marginTop',
          default: '10%',
          comType: 'marginWidth',
        },
      ],
    },
  ],
  settings: [],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        common: {
          showLabel: '显示标签',
          position: '位置',
          width: '宽度',
          height: '高度',
          borderStyle: '边框样式',
          backgroundColor: '背景颜色',
        },
        label: {
          title: '标签',
        },
        breadcrumb: {
          title: '面包屑',
          emptyItemWidth: '最小宽度',
        },
        upperLabel: {
          title: '父节点标签',
        },
        treemap: {
          title: '矩形树图',
          focus: '淡出状态',
          leafDepth: '展示层级',
          visibleMin: '显示模块最小值',
        },
      },
    },
  ],
};

export default config;
