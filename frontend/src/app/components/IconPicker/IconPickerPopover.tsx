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

import { Popover, PopoverProps } from 'antd';
import { FC, useCallback, useMemo, useState } from 'react';
import IconBox from './IconBox';
import IconSelection from './IconSelection';

interface IconPickerPopoverProps {
  popoverProps?: PopoverProps;
  defaultValue?: string;
  value?: string;
  label?: string;
  list?: string[];
  onSubmit?: (color) => void;
  onChange?: (color) => void;
}

export const IconPickerPopover: FC<IconPickerPopoverProps> = ({
  children,
  defaultValue,
  popoverProps,
  list,
  onSubmit,
  onChange,
}) => {
  const [visible, setVisible] = useState(false);
  const [iconName] = useState<string | undefined>(defaultValue);
  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const onIconChange = useCallback(
    icon => {
      onSubmit?.(icon);
      onChange?.(icon);
      onCancel();
    },
    [onSubmit, onCancel, onChange],
  );
  const _popoverProps = useMemo(() => {
    return typeof popoverProps === 'object' ? popoverProps : {};
  }, [popoverProps]);
  return (
    <Popover
      {..._popoverProps}
      visible={visible}
      onVisibleChange={setVisible}
      content={
        <IconSelection list={list} value={iconName} onChange={onIconChange} />
      }
      trigger="click"
      placement="right"
    >
      {children || <IconBox iconName={iconName} />}
    </Popover>
  );
};
