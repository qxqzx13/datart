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
import { Collapse, Form } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardConfigContext } from 'app/pages/DashBoardPage/contexts/BoardConfigContext';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { BoardInfoContext } from 'app/pages/DashBoardPage/contexts/BoardInfoContext';
import {
  DashboardConfig,
  DeviceType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getRGBAColor } from 'app/pages/DashBoardPage/utils';
import produce from 'immer';
import throttle from 'lodash/throttle';
import React, {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { editBoardStackActions } from '../../slice';
import BackgroundSet from './SettingItem/BackgroundSet';
import NumberSet from './SettingItem/BasicSet/NumberSet';
import InitialQuerySet from './SettingItem/InitialQuerySet';
import ScaleModeSet from './SettingItem/ScaleModeSet';
import { Group, SettingPanel } from './SettingPanel';

const { Panel } = Collapse;
export const BoardSetting: FC = memo(() => {
  const t = useI18NPrefix(`viz.board.setting`);
  const dispatch = useDispatch();
  const { boardType } = useContext(BoardContext);

  const { config } = useContext(BoardConfigContext);

  const { deviceType } = useContext(BoardInfoContext);

  const [form] = Form.useForm();
  const cacheValue = useRef<any>({});
  useEffect(() => {
    const { scaleMode, width: boardWidth, height: boardHeight } = config;
    const [marginLR, marginTB] = config.margin;
    const [paddingLR, paddingTB] = config.containerPadding;
    const [mobileMarginLR, mobileMarginTB] = config.mobileMargin;
    const [mobilePaddingLR, mobilePaddingTB] = config.mobileContainerPadding;

    cacheValue.current = {
      backgroundColor: config.background.color,
      backgroundImage: config.background.image,
      scaleMode,
      boardWidth,
      boardHeight,
      marginLR,
      marginTB,
      paddingLR,
      paddingTB,
      mobileMarginLR,
      mobileMarginTB,
      mobilePaddingLR,
      mobilePaddingTB,
      initialQuery: config.initialQuery,
    };
    form.setFieldsValue({ ...cacheValue.current });
  }, [config, form]);

  const onUpdate = useCallback(
    (newValues, config: DashboardConfig) => {
      const value = { ...cacheValue.current, ...newValues };

      const nextConf = produce(config, draft => {
        draft.background.color = getRGBAColor(value.backgroundColor);
        draft.background.image = value.backgroundImage;
        draft.scaleMode = value.scaleMode;
        draft.width = value.boardWidth;
        draft.height = value.boardHeight;
        draft.margin = [value.marginLR, value.marginTB];
        draft.containerPadding = [value.paddingLR, value.paddingTB];
        draft.mobileMargin = [value.mobileMarginLR, value.mobileMarginTB];
        draft.mobileContainerPadding = [
          value.mobilePaddingLR,
          value.mobilePaddingTB,
        ];

        draft.initialQuery = value.initialQuery;
      });
      dispatch(editBoardStackActions.updateBoardConfig(nextConf));
    },
    [dispatch],
  );

  const throttledUpdate = useRef(
    throttle((allValue, config) => onUpdate(allValue, config), 1000),
  );
  const onValuesChange = useCallback(
    (_, allValue) => {
      throttledUpdate.current(allValue, config);
    },
    [throttledUpdate, config],
  );

  return (
    <SettingPanel title={`${t('board')} ${t('setting')}`}>
      <Form
        form={form}
        name="auto-board-from"
        onValuesChange={onValuesChange}
        layout="vertical"
        preserve
      >
        <Collapse
          defaultActiveKey={['background']}
          className="datart-config-panel"
          ghost
        >
          {boardType === 'auto' && (
            <>
              <Panel header={`${t('baseProperty')}`} key="autoSize" forceRender>
                <Group>
                  <NumberSet
                    label={`${t('board')} ${t('paddingTB')}`}
                    name={
                      deviceType === DeviceType.Mobile
                        ? 'mobilePaddingTB'
                        : 'paddingTB'
                    }
                  />
                  <NumberSet
                    label={`${t('board')} ${t('paddingLR')}`}
                    name={
                      deviceType === DeviceType.Mobile
                        ? 'mobilePaddingLR'
                        : 'paddingLR'
                    }
                  />
                  <NumberSet
                    label={`${t('widget')} ${t('marginTB')}`}
                    name={
                      deviceType === DeviceType.Mobile
                        ? 'mobileMarginTB'
                        : 'marginTB'
                    }
                  />
                  <NumberSet
                    label={`${t('widget')} ${t('marginLR')}`}
                    name={
                      deviceType === DeviceType.Mobile
                        ? 'mobileMarginLR'
                        : 'marginLR'
                    }
                  />
                </Group>
              </Panel>
            </>
          )}
          {boardType === 'free' && (
            <>
              <Panel header={t('size')} key="freeSize" forceRender>
                <Group>
                  <NumberSet
                    label={`${t('width')} ( ${t('px')} )`}
                    name={'boardWidth'}
                  />
                  <NumberSet
                    label={`${t('height')} ( ${t('px')} )`}
                    name={'boardHeight'}
                  />
                </Group>
              </Panel>
              <Panel header={t('scaleMode')} key="scale" forceRender>
                <Group>
                  <ScaleModeSet scaleMode={config.scaleMode} />
                </Group>
              </Panel>
            </>
          )}
          <Panel header={t('background')} key="background" forceRender>
            <Group>
              <BackgroundSet background={config.background} />
            </Group>
          </Panel>
          <Panel header={t('queryMode')} key="initialQuery" forceRender>
            <Group>
              <InitialQuerySet
                name="initialQuery"
                label={t('openInitQuery')}
              ></InitialQuerySet>
            </Group>
          </Panel>
        </Collapse>
      </Form>
    </SettingPanel>
  );
});

export default BoardSetting;
