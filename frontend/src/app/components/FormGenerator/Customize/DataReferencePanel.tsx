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

import { ChartStyleConfig } from 'app/types/ChartConfig';
import { mergeChartStyleConfigs } from 'app/utils/internalChartHelper';
import { updateBy, updateByKey } from 'app/utils/mutation';
import { FC, memo, useEffect } from 'react';
import styled from 'styled-components/macro';
import { CloneValueDeep, mergeDefaultToValue } from 'utils/object';
import { GroupLayout } from '../Layout';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const defaultRows = [
  {
    label: 'viz.palette.setting.reference.title',
    key: 'configuration',
    comType: 'tabs',
    options: { editable: true },
    rows: [
      {
        label: 'tab1',
        key: 'tab1',
        comType: 'group',
        rows: [
          {
            label: 'viz.palette.setting.reference.markLine',
            key: 'markLine',
            comType: 'group',
            rows: [
              {
                label: 'viz.palette.setting.reference.enableMarkLine',
                key: 'enableMarkLine',
                default: false,
                comType: 'checkbox',
              },
              {
                label: 'viz.palette.setting.reference.valueType',
                key: 'valueType',
                default: 'constant',
                comType: 'select',
                options: {
                  items: [
                    { label: '常量', value: 'constant' },
                    { label: '平均值', value: 'average' },
                    { label: '最大值', value: 'max' },
                    { label: '最小值', value: 'min' },
                  ],
                },
              },
              {
                label: 'viz.palette.setting.reference.constantValue',
                key: 'constantValue',
                default: 0,
                comType: 'inputNumber',
                watcher: {
                  deps: ['valueType'],
                  action: props => {
                    return {
                      disabled: props.valueType !== 'constant',
                    };
                  },
                },
              },
              {
                label: 'viz.palette.setting.reference.metric',
                key: 'metric',
                comType: 'select',
                watcher: {
                  deps: ['valueType'],
                  action: props => {
                    return {
                      disabled: props.valueType === 'constant',
                    };
                  },
                },
                options: {
                  getItems: cols => {
                    const sections = (cols || []).filter(col =>
                      ['metrics'].includes(col.key),
                    );
                    const columns = sections.reduce(
                      (acc, cur) => acc.concat(cur.rows || []),
                      [],
                    );
                    return columns.map(c => ({
                      key: c.uid,
                      value: c.uid,
                      label:
                        c.label || c.aggregate
                          ? `${c.aggregate}(${c.colName})`
                          : c.colName,
                    }));
                  },
                },
              },
              {
                label: 'viz.palette.setting.reference.showLabel',
                key: 'showLabel',
                comType: 'checkbox',
                options: [],
              },
              {
                label: 'viz.palette.setting.reference.position',
                key: 'position',
                comType: 'select',
                default: 'start',
                options: {
                  items: [
                    { label: '起始', value: 'start' },
                    { label: '中点', value: 'middle' },
                    { label: '结束', value: 'end' },
                  ],
                },
              },
              {
                label: 'viz.palette.setting.reference.lineStyle',
                key: 'lineStyle',
                comType: 'line',
                default: {
                  type: 'solid',
                  width: 1,
                  color: 'blue',
                },
              },
              {
                label: 'viz.palette.setting.reference.font',
                key: 'font',
                comType: 'font',
                default: {
                  fontFamily: 'PingFang SC',
                  fontSize: '12',
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                  color: 'black',
                },
              },
            ],
          },
          {
            label: 'viz.palette.setting.reference.markArea',
            key: 'markArea',
            comType: 'group',
            rows: [
              {
                label: 'viz.palette.setting.reference.enableMarkArea',
                key: 'enableMarkArea',
                default: false,
                comType: 'checkbox',
              },
              {
                label: 'viz.palette.setting.reference.startValueType',
                key: 'startValueType',
                default: 'constant',
                comType: 'select',
                options: {
                  items: [
                    { label: '常量', value: 'constant' },
                    { label: '平均值', value: 'average' },
                    { label: '最大值', value: 'max' },
                    { label: '最小值', value: 'min' },
                  ],
                },
              },
              {
                label: 'viz.palette.setting.reference.startConstantValue',
                key: 'startConstantValue',
                default: 0,
                comType: 'inputNumber',
                watcher: {
                  deps: ['startValueType'],
                  action: props => {
                    return {
                      disabled: props.startValueType !== 'constant',
                    };
                  },
                },
              },
              {
                label: 'viz.palette.setting.reference.startMetric',
                key: 'startMetric',
                comType: 'select',
                watcher: {
                  deps: ['startValueType'],
                  action: props => {
                    return {
                      disabled: props.valueType === 'constant',
                    };
                  },
                },
                options: {
                  getItems: cols => {
                    const columns = (cols || [])
                      .filter(col => ['metrics'].includes(col.key))
                      .reduce((acc, cur) => acc.concat(cur.rows || []), [])
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
                label: 'viz.palette.setting.reference.endValueType',
                key: 'endValueType',
                default: 'constant',
                comType: 'select',
                options: {
                  items: [
                    { label: '常量', value: 'constant' },
                    { label: '平均值', value: 'average' },
                    { label: '最大值', value: 'max' },
                    { label: '最小值', value: 'min' },
                  ],
                },
              },
              {
                label: 'viz.palette.setting.reference.endConstantValue',
                key: 'endConstantValue',
                default: 0,
                comType: 'inputNumber',
                watcher: {
                  deps: ['endValueType'],
                  action: props => {
                    return {
                      disabled: props.endValueType !== 'constant',
                    };
                  },
                },
              },
              {
                label: 'viz.palette.setting.reference.endMetric',
                key: 'endMetric',
                comType: 'select',
                watcher: {
                  deps: ['endValueType'],
                  action: props => {
                    return {
                      disabled: props.valueType === 'constant',
                    };
                  },
                },
                options: {
                  getItems: cols => {
                    const columns = (cols || [])
                      .filter(col => ['metrics'].includes(col.key))
                      .reduce((acc, cur) => acc.concat(cur.rows || []), [])
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
                label: 'viz.palette.setting.reference.showLabel',
                key: 'showLabel',
                comType: 'checkbox',
              },
              {
                label: 'viz.palette.setting.reference.position',
                key: 'position',
                comType: 'select',
                default: 'start',
                options: {
                  items: [
                    { label: '起始', value: 'start' },
                    { label: '中点', value: 'middle' },
                    { label: '结束', value: 'end' },
                  ],
                },
              },
              {
                label: 'viz.palette.setting.reference.font',
                key: 'font',
                comType: 'font',
                default: {
                  fontFamily: 'PingFang SC',
                  fontSize: '12',
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                  color: 'black',
                },
              },
              {
                label: 'viz.palette.setting.reference.backgroundColor',
                key: 'backgroundColor',
                default: 'grey',
                comType: 'fontColor',
              },
              {
                label: 'viz.palette.setting.reference.opacity',
                key: 'opacity',
                default: 0.6,
                comType: 'select',
                options: {
                  items: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                },
              },
              {
                label: 'viz.palette.setting.reference.borderStyle',
                key: 'borderStyle',
                comType: 'line',
                default: {
                  type: 'dashed',
                  width: 1,
                  color: 'grey',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

const DataReferencePanel: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({ ancestors, translate: t, data, dataConfigs, onChange }) => {
    useEffect(() => {
      // init default component rows
      if (!data?.rows?.length) {
        const newData = updateByKey(
          data,
          'rows',
          mergeDefaultToValue(CloneValueDeep(defaultRows)),
        );
        onChange?.(ancestors, newData);
      } else {
        if (!data.rows[0].comType) {
          const newData = updateBy(data, draft => {
            draft['rows'] = mergeChartStyleConfigs(
              CloneValueDeep(defaultRows),
              data?.rows,
            );
          });
          onChange?.(ancestors, newData);
        }
      }
    }, [ancestors, data, onChange]);

    return (
      <StyledDataReferencePanel>
        <GroupLayout
          ancestors={ancestors}
          data={data}
          translate={t}
          dataConfigs={dataConfigs}
          onChange={onChange}
        />
      </StyledDataReferencePanel>
    );
  },
  itemLayoutComparer,
);

export default DataReferencePanel;

const StyledDataReferencePanel = styled.div``;
