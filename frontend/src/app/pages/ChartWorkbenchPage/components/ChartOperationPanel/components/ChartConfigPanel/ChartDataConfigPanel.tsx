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

import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import { FC, memo, useContext } from 'react';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import ChartAggregationContext from '../../../../contexts/ChartAggregationContext';
import PaletteDataConfig from '../ChartDataConfigSection';

const ChartDataConfigPanel: FC<{
  dataConfigs?: ChartDataConfig[];
  onChange: (
    ancestors: number[],
    config: ChartDataConfig,
    needRefresh?: boolean,
  ) => void;
}> = memo(
  ({ dataConfigs, onChange }) => {
    const translate = useI18NPrefix(`viz.palette.data`);
    const { aggregation } = useContext(ChartAggregationContext);

    const getSectionComponent = (config, index) => {
      const props = {
        key: config?.key || index,
        ancestors: [index],
        config,
        translate,
        aggregation,
        onConfigChanged: (ancestors, config, needRefresh?: boolean) => {
          onChange?.(ancestors, config, needRefresh);
        },
      };

      switch (props.config?.type) {
        case ChartDataSectionType.GROUP:
          return <PaletteDataConfig.GroupTypeSection {...props} />;
        case ChartDataSectionType.AGGREGATE:
          return <PaletteDataConfig.AggregateTypeSection {...props} />;
        case ChartDataSectionType.MIXED:
          return <PaletteDataConfig.MixedTypeSection {...props} />;
        case ChartDataSectionType.FILTER:
          return <PaletteDataConfig.FilterTypeSection {...props} />;
        case ChartDataSectionType.INFO:
          return <PaletteDataConfig.InfoTypeSection {...props} />;
        case ChartDataSectionType.COLOR:
          return <PaletteDataConfig.ColorTypeSection {...props} />;
        case ChartDataSectionType.SIZE:
          return <PaletteDataConfig.SizeTypeSection {...props} />;
        default:
          return <PaletteDataConfig.BaseDataConfigSection {...props} />;
      }
    };

    return (
      <StyledChartDataConfigPanel>
        {(dataConfigs || []).map(getSectionComponent)}
      </StyledChartDataConfigPanel>
    );
  },
  (prev, next) => {
    return prev.dataConfigs === next.dataConfigs;
  },
);

export default ChartDataConfigPanel;

const StyledChartDataConfigPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${SPACE_XS} 0;
`;
