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

import { Form, Input, Modal, ModalProps } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import debounce from 'debounce-promise';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { request } from 'utils/request';
import { selectSaveOrganizationLoading } from './slice/selectors';
import { addOrganization } from './slice/thunks';
const FormItem = Form.Item;

interface OrganizationFormProps extends Omit<ModalProps, 'onCancel'> {
  onCancel: () => void;
}

export function OrganizationForm({ visible, onCancel }: OrganizationFormProps) {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(selectSaveOrganizationLoading);
  const [form] = Form.useForm();
  const t = useI18NPrefix('main.nav.organization');
  const tg = useI18NPrefix('global');

  const formSubmit = useCallback(
    values => {
      dispatch(
        addOrganization({
          organization: values,
          resolve: () => {
            onCancel();
            history.push('/');
          },
        }),
      );
    },
    [dispatch, history, onCancel],
  );

  const afterClose = useCallback(() => {
    form.resetFields();
  }, [form]);

  const save = useCallback(() => {
    form.submit();
  }, [form]);

  return (
    <Modal
      title={t('create')}
      visible={visible}
      okText={t('save')}
      confirmLoading={loading}
      onOk={save}
      onCancel={onCancel}
      afterClose={afterClose}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        labelAlign="left"
        wrapperCol={{ span: 16 }}
        onFinish={formSubmit}
      >
        <FormItem
          name="name"
          label={t('name')}
          rules={[
            {
              required: true,
              message: `${t('name')}${tg('validation.required')}`,
            },
            {
              validator: debounce((_, value) => {
                return request({
                  url: `/orgs/check/name`,
                  method: 'POST',
                  data: { name: value },
                }).then(
                  () => Promise.resolve(),
                  err => Promise.reject(new Error(err.response.data.message)),
                );
              }, DEFAULT_DEBOUNCE_WAIT),
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem name="description" label={t('desc')}>
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} />
        </FormItem>
      </Form>
    </Modal>
  );
}
