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

import { Collapse } from 'antd';
import CollapseHeader from 'app/components/FormGenerator/CollapseHeader';
import GroupLayout from 'app/components/FormGenerator/Layout/GroupLayout';
import { GroupLayoutMode } from 'app/components/FormGenerator/types';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataConfig, ChartStyleConfig } from 'app/types/ChartConfig';
import { FC, memo } from 'react';

const ChartStyleConfigPanel: FC<{
  configs?: ChartStyleConfig[];
  dataConfigs?: ChartDataConfig[];
  onChange: (
    ancestors: number[],
    config: ChartStyleConfig,
    needRefresh?: boolean,
  ) => void;
}> = memo(
  ({ configs, dataConfigs, onChange }) => {
    const t = useI18NPrefix(`viz.palette.style`);
    return (
      <Collapse className="datart-config-panel" ghost>
        {configs
          ?.filter(c => !Boolean(c.hidden))
          .map((c, index) => (
            <Collapse.Panel
              header={<CollapseHeader title={t(c.label, true)} />}
              key={c.key}
            >
              <GroupLayout
                ancestors={[index]}
                mode={
                  c.comType === 'group'
                    ? GroupLayoutMode.INNER
                    : GroupLayoutMode.OUTTER
                }
                data={c}
                translate={t}
                dataConfigs={dataConfigs}
                onChange={onChange}
              />
            </Collapse.Panel>
          ))}
      </Collapse>
    );
  },
  (prev, next) =>
    prev.configs === next.configs && prev.dataConfigs === next.dataConfigs,
);

export default ChartStyleConfigPanel;
