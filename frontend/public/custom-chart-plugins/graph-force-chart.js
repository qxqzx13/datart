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

function GraphForceChart({ dHelper }) {
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          type: 'group',
          required: true,
          limit: 1,
        },
        {
          label: 'section.relation',
          key: 'relation',
          type: 'group',
        },
        {
          label: 'size',
          key: 'size',
          type: 'size',
        },
      ],
      styles: [
        {
          label: 'force.title',
          key: 'force',
          comType: 'group',
          rows: [
            {
              label: 'force.gravity',
              key: 'gravity',
              default: 1,
              comType: 'slider',
            },
            {
              label: 'force.draggable',
              key: 'draggable',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'force.repulsion',
              key: 'repulsion',
              default: 400,
              options: {
                min: 0,
              },
              comType: 'inputNumber',
            },
            {
              label: 'force.edgeLength',
              key: 'edgeLength',
              default: 100,
              options: {
                min: 0,
              },
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'symbol.title',
          key: 'symbol',
          comType: 'group',
          rows: [
            {
              label: 'symbol.cycleRatio',
              key: 'cycleRatio',
              comType: 'slider',
              default: 1,
            },
            {
              label: 'common.color',
              key: 'color',
              comType: 'fontColor',
              default: '#509af2',
            },
            {
              label: 'common.lineStyle',
              key: 'lineStyle',
              default: {
                type: 'solid',
                width: 0,
                color: '#D9D9D9',
              },
              comType: 'line',
            },
          ],
        },
        {
          label: 'label.title',
          key: 'label',
          comType: 'group',
          rows: [
            {
              label: 'label.labelShow',
              key: 'labelShow',
              comType: 'checkbox',
              default: true,
            },
            {
              label: 'common.position',
              key: 'position',
              comType: 'select',
              default: 'top',
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
          label: 'edge.title',
          key: 'edge',
          comType: 'group',
          rows: [
            {
              label: 'edge.edgeSymbol',
              key: 'edgeSymbol',
              comType: 'select',
              default: 'none',
              options: {
                items: [
                  { label: '无', value: 'none' },
                  { label: '箭头', value: 'arrow' },
                  { label: '圆形', value: 'circle' },
                  { label: '菱形', value: 'diamond' },
                  { label: '三角形', value: 'triangle' },
                  { label: '矩形', value: 'rect' },
                  { label: '圆角矩形', value: 'roundRect' },
                ],
              },
            },
            {
              label: 'edge.edgeSymbolSize',
              key: 'edgeSymbolSize',
              default: 10,
              options: {
                min: 0,
              },
              comType: 'inputNumber',
            },
            {
              label: 'edge.lineStyle',
              key: 'lineStyle',
              default: {
                type: 'solid',
                width: 1,
                color: '#D9D9D9',
              },
              comType: 'line',
            },
            {
              label: 'edge.curveness',
              key: 'curveness',
              default: 0,
              options: {
                min: 0,
              },
              comType: 'inputNumber',
            },
          ],
        },
      ],
      settings: [],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            section: {
              relation: '关系',
            },
            common: {
              lineStyle: '边框样式',
              position: '位置',
              color: '颜色',
            },
            force: {
              title: '力引导配置',
              gravity: '引力',
              repulsion: '节点斥力',
              draggable: '节点拖拽',
              edgeLength: '节点距离',
            },
            edge: {
              title: '关系线',
              edgeSymbol: '标记类型',
              edgeSymbolSize: '标记大小',
              curveness: '线条曲度',
              lineStyle: '线条样式',
            },
            symbol: {
              title: '节点',
              cycleRatio: '气泡大小',
            },
            label: {
              title: '节点标签',
              labelShow: '显示标签',
            },
          },
        },
      ],
    },
    isISOContainer: 'gauge-chart',
    dependency: ['https://lib.baomitu.com/echarts/5.0.2/echarts.min.js'],
    meta: {
      id: 'graph-force-chart',
      name: '力引导关系图',
      icon: 'graph',
      requirements: [
        {
          group: 1,
        },
      ],
    },
    onMount(options, context) {
      if ('echarts' in context.window) {
        this.chart = context.window.echarts.init(
          context.document.getElementById(options.containerId),
          'default',
        );
      }
    },
    onUpdated(props) {
      if (!props.dataset || !props.dataset.columns || !props.config) {
        return;
      }
      if (!this.isMatchRequirement(props.config)) {
        this.chart?.clear();
        return;
      }
      const newOptions = this.getOptions(props.dataset, props.config);
      this.chart?.setOption(Object.assign({}, newOptions), true);
    },
    onUnMount() {
      this.chart && this.chart.dispose();
    },
    onResize(opt, context) {
      this.chart && this.chart.resize(context);
    },
    getOptions(dataset, config) {
      const styleConfigs = config.styles;
      const dataConfigs = config.datas || [];
      const groupConfigs = dataConfigs
        .filter(c => c.type === 'group' && c.key === 'dimension')
        .flatMap(config => config.rows || []);
      const relationConfigs = dataConfigs
        .filter(c => c.type === 'group' && c.key === 'relation')
        .flatMap(config => config.rows || []);
      const sizeConfigs = dataConfigs
        .filter(c => c.type === 'size')
        .flatMap(config => config.rows || []);
      const dataColumns = dHelper.transfromToObjectArray(
        dataset.rows,
        dataset.columns,
      );
      const series = this.getSeries(
        styleConfigs,
        dataColumns,
        groupConfigs,
        sizeConfigs,
        relationConfigs,
      );
      return {
        tooltip: {
          formatter: params => {
            const { name, value, dataType } = params;
            return dataType === 'node'
              ? `${name}<br />${dHelper.valueFormatter(sizeConfigs[0], value)}`
              : name;
          },
        },
        series,
      };
    },
    getSeries(
      styleConfigs,
      dataColumns,
      groupConfigs,
      sizeConfigs,
      relationConfigs,
    ) {
      const { min, max } = dHelper.getDataColumnMaxAndMin(
        dataColumns,
        sizeConfigs[0],
      );
      const cycleRatio = dHelper.getStyleValueByGroup(
        styleConfigs,
        'symbol',
        'cycleRatio',
      );
      const defaultSizeValue = (max - min) / 2;

      const force = this.getForceConfig(styleConfigs);
      const edge = this.getEdgeConfig(styleConfigs);
      const symbol = this.getSymbolConfig(styleConfigs);
      const label = this.getLabelConfig(styleConfigs);
      const data = this.initData(
        dataColumns,
        groupConfigs,
        sizeConfigs,
        defaultSizeValue,
      );
      const links = this.initLinks(dataColumns, groupConfigs, relationConfigs);

      return [
        {
          type: 'graph',
          layout: 'force',
          roam: true,
          symbolSize: dHelper.getScatterSymbolSizeFn(0, max, min, cycleRatio),
          ...force,
          ...edge,
          ...symbol,
          label,
          data,
          links,
        },
      ];
    },
    initData(dataColumns, groupConfigs, sizeConfigs, defaultSizeValue) {
      const data = [];
      const groupName = dHelper.getValueByColumnKey(groupConfigs[0]);
      const sizeName = dHelper.getValueByColumnKey(sizeConfigs[0]);
      dataColumns.forEach(dc => {
        const name = dc[groupName];
        const existedData = data.length && data.find(v => v?.name === name);
        if (!existedData) {
          data.push({
            name,
            value: [dc[sizeName] || defaultSizeValue],
          });
        }
      });
      return data;
    },
    initLinks(dataColumns, groupConfigs, relationConfigs) {
      const links = [];
      const relationKey = dHelper.getValueByColumnKey(relationConfigs[0]);
      const groupKey = dHelper.getValueByColumnKey(groupConfigs[0]);
      if (relationKey && groupKey) {
        dataColumns.forEach(dc => {
          const [sourceConfig] = dataColumns.filter(config => {
            const configNum = Number(config[relationKey]),
              dcNum = Number(dc[relationKey]);
            if (isNaN(configNum) || isNaN(dcNum)) {
              return false;
            }
            return configNum < 0 && Math.abs(configNum) === Number(dcNum);
          });
          if (sourceConfig && dc) {
            const source = sourceConfig[groupKey],
              target = dc[groupKey];
            const existedLinks =
              source === target ||
              links?.find(v => v?.source === source && v?.target === target);
            if (!existedLinks) {
              links.push({
                source,
                target,
              });
            }
          }
        });
      }
      return links;
    },
    getForceConfig(style) {
      const [repulsion, gravity, edgeLength, draggable] =
        this.getArrStyleValueByGroup(
          ['repulsion', 'gravity', 'edgeLength', 'draggable'],
          style,
          'force',
        );
      return {
        force: {
          repulsion,
          gravity: (gravity && Number(gravity / 10)) || 0.1,
          edgeLength,
        },
        draggable,
      };
    },
    getEdgeConfig(style) {
      const [edgeSymbol, edgeSymbolSize, lineStyle, curveness] =
        this.getArrStyleValueByGroup(
          ['edgeSymbol', 'edgeSymbolSize', 'lineStyle', 'curveness'],
          style,
          'edge',
        );
      return {
        edgeSymbol: ['none', edgeSymbol],
        edgeSymbolSize,
        lineStyle: {
          ...lineStyle,
          curveness: (curveness && Number(curveness / 100)) || 0,
        },
      };
    },
    getSymbolConfig(style) {
      const [symbolColor, { type, color, width }] =
        this.getArrStyleValueByGroup(['color', 'lineStyle'], style, 'symbol');
      return {
        itemStyle: {
          color: symbolColor,
          borderWidth: width,
          borderType: type,
          borderColor: color,
        },
      };
    },
    getLabelConfig(style) {
      const [show, position, font] = this.getArrStyleValueByGroup(
        ['labelShow', 'position', 'font'],
        style,
        'label',
      );
      return {
        show,
        position,
        formatter: '{b}',
        ...font,
      };
    },
    getArrStyleValueByGroup(childPathList, style, groupPath) {
      return childPathList.map(child => {
        return dHelper.getStyleValueByGroup(style, groupPath, child);
      });
    },
  };
}
