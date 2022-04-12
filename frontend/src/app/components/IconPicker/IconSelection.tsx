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

import classnames from 'classnames';
import { ICON_LIST } from 'globalConstants';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG, SPACE_TIMES } from 'styles/StyleConstants';
import IconBox from './IconBox';

const IconSelection: FC<{
  defaultValue?: string;
  value?: string;
  list?: string[];
  onChange: (icon: string) => void;
}> = memo(({ defaultValue, list, onChange, value }) => {
  const [useIconName, setUseIconName] = useState<string | undefined>(
    defaultValue,
  );

  const changeIcon = useCallback(
    (name: string) => {
      setUseIconName(name);
      onChange(name);
    },
    [onChange],
  );

  useEffect(() => {
    setUseIconName(value);
  }, [value]);

  return (
    <IconSelectionWrapper>
      {(list || ICON_LIST).map(item => {
        return (
          <StyledIconWrapper
            key={item}
            className={classnames({
              active: item === useIconName,
            })}
            onClick={() => changeIcon(item)}
          >
            <IconBox
              size={SPACE_LG}
              style={{ lineHeight: SPACE_TIMES(6) }}
              iconName={item}
            />
          </StyledIconWrapper>
        );
      })}
    </IconSelectionWrapper>
  );
});

export default IconSelection;

const IconSelectionWrapper = styled.div`
  width: 200px;
`;

const StyledIconWrapper = styled.span`
  display: inline-block;
  min-width: ${SPACE_TIMES(6)};
  height: ${SPACE_TIMES(6)};
  margin: ${SPACE_TIMES(1)};
  text-align: center;
  cursor: pointer;
  border-radius: ${BORDER_RADIUS};

  &:hover,
  &.active {
    color: ${p => p.theme.componentBackground};
    background-color: ${p => p.theme.primary};
  }
`;
