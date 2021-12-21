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

import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import {
  getCustomSortableColumns,
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
  valueFormatter,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import Config from './config';

interface DataConfig {
  name: string;
  path: string;
  children?: DataConfig[];
  value: number[];
}

class BasicTreemapChart extends Chart {
  config = Config;
  chart: any = null;

  constructor(props?) {
    super(
      props?.id || 'treemap-chart',
      props?.name || '矩形树图',
      props?.icon || 'treemap',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: [1, 999],
        aggregate: 1,
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }

    this.chart = init(
      context.document.getElementById(options.containerId),
      'default',
    );
  }

  onUpdated(props): void {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    if (!this.isMatchRequirement(props.config)) {
      this.chart?.clear();
      return;
    }
    const newOptions = this.getOptions(props.dataset, props.config);
    this.chart?.setOption(Object.assign({}, newOptions), true);
  }

  onUnMount(): void {
    this.chart?.dispose();
  }

  onResize(opt: any, context): void {
    this.chart?.resize(context);
  }

  getOptions(dataset: ChartDataset, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);
    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);
    const series = this.getSeries(
      dataColumns,
      groupConfigs,
      aggregateConfigs,
      infoConfigs,
      styleConfigs,
    );
    const tooltip = this.getTooltip(infoConfigs, aggregateConfigs);
    return {
      tooltip,
      series,
    };
  }

  getTooltip(infoConfigs, aggregateConfigs) {
    return {
      formatter: function (data) {
        if (!data?.data?.path) {
          return '';
        }
        const infoList = infoConfigs.map((item, index) => {
          return valueFormatter(item, data.data.value[index + 1]);
        });
        const list = [
          data?.data?.path,
          valueFormatter(aggregateConfigs[0], data.data.value[0]),
        ]
          .concat(infoList)
          .join('<br>');
        return list;
      },
    };
  }

  getSeries(data, group, aggregate, info, styles) {
    const label = this.getLabelConfig(styles);
    const breadcrumb = this.getBreadcrumbConfig(styles);
    const upperLabel = this.getUpperLabelConfig(styles);
    const treemap = this.getTreemapConfig(styles, upperLabel);
    const levels = this.getLevelsConfig(group);
    return [
      {
        ...treemap,
        label,
        upperLabel,
        breadcrumb,
        blur: {
          label,
          upperLabel,
        },
        levels,
        data: this.getData(data, group, aggregate, info),
      },
    ];
  }

  getLevelsConfig(group) {
    const levels: any[] = [];
    if (!(group && group.length)) {
      return null;
    }
    for (let i = group.length; i > 0; i--) {
      levels.unshift({
        itemStyle: {
          borderWidth: 5,
          gapWidth: 5,
          borderColorSaturation: 0.6,
        },
      });
    }
    levels[0] = Object.assign(levels[0], {
      upperLabel: {
        show: false,
      },
    });
    levels[group.length - 1] = Object.assign(levels[group.length - 1], {
      colorSaturation: [0.35, 0.5],
    });
    return levels;
  }

  getUpperLabelConfig(styles) {
    const [show, position, height, font] = this.getArrStyleValueByGroup(
      ['showLabel', 'position', 'height', 'font'],
      styles,
      'upperLabel',
    );
    return {
      show,
      height,
      position,
      ...font,
    };
  }

  getBreadcrumbConfig(styles) {
    const [
      show,
      height,
      emptyItemWidth,
      textStyle,
      { type, width, color },
      backgroundColor,
      position,
    ] = this.getArrStyleValueByGroup(
      [
        'showLabel',
        'height',
        'emptyItemWidth',
        'font',
        'borderStyle',
        'backgroundColor',
        'position',
      ],
      styles,
      'breadcrumb',
    );

    return {
      show,
      left: position.split(',')[0],
      top: position.split(',')[1],
      height,
      emptyItemWidth,
      itemStyle: {
        borderColor: color,
        borderWidth: width,
        borderTyle: type,
        color: backgroundColor,
        textStyle,
      },
    };
  }

  getTreemapConfig(styles, upperLabel) {
    const [left, top] = this.getArrStyleValueByGroup(
      ['marginLeft', 'marginTop'],
      styles,
      'margin',
    );
    const [width, height, focus, leafDepth, visibleMin] =
      this.getArrStyleValueByGroup(
        ['width', 'height', 'focus', 'leafDepth', 'visibleMin'],
        styles,
        'treemap',
      );
    return {
      type: 'treemap',
      left,
      top,
      width,
      height,
      emphasis: {
        focus,
        upperLabel,
      },
      leafDepth: leafDepth || null,
      visibleMin,
    };
  }

  getLabelConfig(styles) {
    const [show, position, font] = this.getArrStyleValueByGroup(
      ['showLabel', 'position', 'font'],
      styles,
      'label',
    );
    return {
      show,
      position,
      ...font,
      formatter: function ({ data }) {
        return data?.path?.replace(/\//g, '\n');
      },
    };
  }

  getData(dataColumns, groupConfigs, aggregateConfigs, infoConfigs) {
    const data: DataConfig[] = [];
    dataColumns.forEach(dc => {
      let path: any[] = [];
      const list = groupConfigs.map((gc, index) => {
        const name = dc[getValueByColumnKey(gc)];
        path.push(name);
        const infoList = infoConfigs.map(info => dc[getValueByColumnKey(info)]);
        const value =
          groupConfigs.length - 1 > index
            ? [0]
            : [dc[getValueByColumnKey(aggregateConfigs[0])]];
        return {
          name,
          groupKey: getValueByColumnKey(gc),
          path: path.concat().join('/'),
          children: [],
          value: value.concat(infoList),
        };
      });
      this.getChildren(list, data, 0);
    });
    return data;
  }

  getChildren = (configList, list, index) => {
    let data: DataConfig = list.find(v => v.path === configList[index].path);
    if (!data) {
      data = {
        name: configList[index].name,
        path: configList[index].path,
        value: configList[index].value,
        children: [],
      };
      list.push(data);
    }
    index + 1 < configList.length &&
      this.getChildren(configList, data.children, index + 1);
    if (data.children?.length) {
      data.value = [];
      data.children?.forEach(({ value }) => {
        value.forEach((num, index) => {
          data.value[index] += num || 0;
        });
      });
    }
  };

  getArrStyleValueByGroup(childPathList, style, groupPath) {
    return childPathList.map(child => {
      return getStyleValueByGroup(style, groupPath, child);
    });
  }
}

export default BasicTreemapChart;
