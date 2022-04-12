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
import { Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import { ColorPickerPopover } from 'app/components/ColorPicker';
import { DataViewFieldType } from 'app/constants';
import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { isEmpty } from 'utils/object';
import IconPickerPopover from '../../../IconPicker';
import IconBox from '../../../IconPicker/IconBox';
import {
  ConditionalOperatorTypes,
  OperatorTypes,
  OperatorTypesLocale,
} from '../ConditionalStyle/types';
import {
  REDUCED_VALUE_LIST,
  ScorecardConditionalStyleFormValues,
  ScorecardConstantConfig,
} from './types';

interface AddProps {
  context?: any;
  allItems?: any[];
  translate?: (title: string, options?: any) => string;
  visible: boolean;
  values: ScorecardConditionalStyleFormValues;
  onOk: (values: ScorecardConditionalStyleFormValues) => void;
  onCancel: () => void;
}

export default function Add({
  translate: t = title => title,
  values,
  visible,
  onOk,
  onCancel,
  context,
  allItems,
}: AddProps) {
  const [colors] = useState([
    {
      name: 'textColor',
      label: t('conditionalStyleTable.header.color.text'),
      value: ScorecardConstantConfig.TEXT_COLOR,
    },
    {
      name: 'background',
      label: t('conditionalStyleTable.header.color.background'),
      value: ScorecardConstantConfig.BACKGROUND,
    },
  ]);

  const [colorIcon] = useState({
    name: 'iconName',
    label: t('conditionalStyleTable.header.color.icon'),
    value: ScorecardConstantConfig.ICON_NAME,
  });
  const [operatorSelect, setOperatorSelect] = useState<
    { label: string; value: string }[]
  >([]);
  const [operatorValue, setOperatorValue] = useState<OperatorTypes>(
    OperatorTypes.Equal,
  );
  const [form] = Form.useForm<ScorecardConditionalStyleFormValues>();
  const [type] = useState(DataViewFieldType.NUMERIC);
  const [useSecondaryMetrics, setSecondaryMetrics] = useState<boolean>(false);
  const [useReducedValue, setUseReducedValue] = useState<string>(
    REDUCED_VALUE_LIST[0].value,
  );

  useEffect(() => {
    if (type) {
      setOperatorSelect(
        ConditionalOperatorTypes[type]?.map(item => ({
          label: `${OperatorTypesLocale[item]} [${item}]`,
          value: item,
        })),
      );
    } else {
      setOperatorSelect([]);
    }
  }, []);

  useEffect(() => {
    // !重置form
    if (visible) {
      if (values && Object.keys(values).length !== 0) {
        setUseReducedValue(values.reducedValue || REDUCED_VALUE_LIST[0].value);
        setSecondaryMetrics(
          !!allItems?.findIndex(v => v.value === values.metricKey),
        );
      } else {
        setUseReducedValue(REDUCED_VALUE_LIST[0].value);
        setSecondaryMetrics(false);
      }
      const result: Partial<ScorecardConditionalStyleFormValues> =
        Object.keys(values).length === 0
          ? {
              operator: OperatorTypes.Equal,
              color: {
                background: ScorecardConstantConfig.BACKGROUND,
                textColor: ScorecardConstantConfig.TEXT_COLOR,
                iconName: ScorecardConstantConfig.ICON_NAME,
              },
              metricKey: allItems?.[0]?.value,
              reducedValue: REDUCED_VALUE_LIST[0].value,
            }
          : values;
      form.setFieldsValue(result);
      setOperatorValue(result.operator ?? OperatorTypes.Equal);
    }
  }, [form, visible, values, allItems]);

  const modalOk = () => {
    form.validateFields().then(values => {
      onOk({
        ...values,
        target: {
          name: context?.label,
          type: context?.type,
        },
      });
    });
  };

  const metricChange = (value: string) => {
    const status = !!allItems?.findIndex(v => v.value === value);
    if (status) {
      form.setFieldsValue({
        reducedValue: REDUCED_VALUE_LIST[0].value,
        color: { iconName: ScorecardConstantConfig.ICON_NAME },
      });
      setUseReducedValue(REDUCED_VALUE_LIST[0].value);
    }
    setSecondaryMetrics(status);
  };

  const reducedValueChange = (value: string) => {
    setUseReducedValue(value);
  };

  const operatorChange = (value: OperatorTypes) => {
    if (value === ScorecardConstantConfig.BETWEEN) {
      form.setFieldsValue({ reducedValue: REDUCED_VALUE_LIST[0].value });
      setUseReducedValue(REDUCED_VALUE_LIST[0].value);
    }
    setOperatorValue(value);
  };

  const renderValueNode = () => {
    let DefaultNode = <></>;
    switch (type) {
      case DataViewFieldType.NUMERIC:
        DefaultNode = (
          <InputNumber
            disabled={useReducedValue === ScorecardConstantConfig.METRICS}
          />
        );
        break;
      default:
        DefaultNode = <Input />;
        break;
    }

    switch (operatorValue) {
      case OperatorTypes.In:
      case OperatorTypes.NotIn:
        return (
          <Select
            mode="tags"
            notFoundContent={
              <>{t('conditionalStyleTable.modal.notFoundContent')}</>
            }
          />
        );
      case OperatorTypes.Between:
        return <InputNumberScope />;
      default:
        return DefaultNode;
    }
  };

  return (
    <Modal
      destroyOnClose
      title={t('conditionalStyleTable.modal.title')}
      visible={visible}
      onOk={modalOk}
      onCancel={onCancel}
    >
      <Form
        name="scorecard-conditional-style-form"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        preserve={false}
        form={form}
        autoComplete="off"
      >
        <Form.Item label="uid" name="uid" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('viz.palette.data.metrics', true)}
          name="metricKey"
          rules={[{ required: true }]}
        >
          <Select onChange={metricChange}>
            {allItems?.map((o, index) => {
              const label = isEmpty(o['label']) ? o : o.label;
              const key = isEmpty(o['key']) ? index : o.key;
              const value = isEmpty(o['value']) ? o : o.value;
              return (
                <Select.Option key={key} value={value}>
                  {label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('conditionalStyleTable.header.operator')}
          name="operator"
          rules={[{ required: true }]}
        >
          <Select options={operatorSelect} onChange={operatorChange} />
        </Form.Item>

        {operatorValue !== OperatorTypes.IsNull ? (
          <>
            {useSecondaryMetrics && (
              <Form.Item
                label={t('conditionalStyleTable.header.reducedValue')}
                name="reducedValue"
                rules={[{ required: true }]}
              >
                <Select
                  onChange={reducedValueChange}
                  disabled={operatorValue === ScorecardConstantConfig.BETWEEN}
                >
                  {REDUCED_VALUE_LIST?.map(o => {
                    return (
                      <Select.Option key={o.value} value={o.value}>
                        {t(o.label)}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
            {(!useSecondaryMetrics ||
              useReducedValue !== ScorecardConstantConfig.METRICS) && (
              <Form.Item
                label={t('conditionalStyleTable.header.value')}
                name="value"
                rules={[{ required: true }]}
              >
                {renderValueNode()}
              </Form.Item>
            )}
          </>
        ) : null}

        <Form.Item label={t('conditionalStyleTable.header.color.title')}>
          <Row gutter={24} align="middle">
            {colors.map(
              ({ label, value, name }) =>
                (name !== 'background' || !useSecondaryMetrics) && (
                  <Form.Item key={label} name={['color', name]} noStyle>
                    <ColorSelector label={label} value={value} />
                  </Form.Item>
                ),
            )}
            {useSecondaryMetrics && (
              <Form.Item
                key={colorIcon.name}
                name={['color', colorIcon.name]}
                noStyle
              >
                <IconSelector label={colorIcon.label} value={colorIcon.value} />
              </Form.Item>
            )}
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
}

const ColorSelector = memo(
  ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value?: string;
    onChange?: (value: any) => void;
  }) => {
    return (
      <>
        <Col>{label}</Col>
        <Col>
          <ColorPickerPopover defaultValue={value} onSubmit={onChange}>
            <StyledColor color={value} />
          </ColorPickerPopover>
        </Col>
      </>
    );
  },
);

const IconSelector = memo(
  ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange?: (value: any) => void;
  }) => {
    return (
      <>
        <Col>{label}</Col>
        <Col>
          <IconPickerPopover defaultValue={value} onSubmit={onChange}>
            <StyledColor>
              <IconBox iconName={value} />
            </StyledColor>
          </IconPickerPopover>
        </Col>
      </>
    );
  },
);

const InputNumberScope = memo(
  ({
    value,
    onChange,
  }: {
    value?: [number, number];
    onChange?: (value: any) => void;
  }) => {
    const [[min, max], setState] = useState<
      [number | undefined, number | undefined]
    >([undefined, undefined]);
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
      setIndex(index + 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (Array.isArray(value)) {
        setState([Number(value[0]), Number(value[1])]);
      } else {
        setState([value, undefined]);
      }
    }, [value]);

    const inputNumberScopeChange = state => {
      setState(state);
      const result = state.filter(num => typeof num === 'number');
      if (result.length === 2) {
        onChange?.(state);
      } else {
        onChange?.(undefined);
      }
    };

    const minChange = (value: number) => inputNumberScopeChange([value, max]);
    const maxChange = (value: number) => inputNumberScopeChange([min, value]);

    return (
      <Row gutter={24} align="middle" key={index}>
        <Col>
          <InputNumber
            placeholder="最小值"
            defaultValue={min}
            onChange={minChange}
          />
        </Col>
        <Col>-</Col>
        <Col>
          <InputNumber
            placeholder="最大值"
            defaultValue={max}
            onChange={maxChange}
          />
        </Col>
      </Row>
    );
  },
);

const StyledColor = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
  line-height: 1;
  cursor: pointer;

  background-color: ${props => props.color};
  ::after {
    position: absolute;
    top: -7px;
    left: -7px;
    display: inline-block;
    width: 30px;
    height: 30px;
    content: '';
    border: 1px solid ${p => p.theme.borderColorBase};
    border-radius: 5px;
  }
`;
