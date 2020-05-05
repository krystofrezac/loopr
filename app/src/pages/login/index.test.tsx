import React from 'react';

import { describe, expect, it, jest } from '@jest/globals';
import { mount } from 'enzyme';
import Login from 'pages/login/login';
import { act } from 'react-dom/test-utils';

import hookFormType from 'lib/jest/hookFormType';
import testId from 'lib/jest/testId';

describe('<Login/>', () => {
  it('Should not fire on submit', async () => {
    const submitHandler = jest.fn(() => {});
    await act(async () => {
      const wrapper = mount(<Login onSubmit={submitHandler} />);

      wrapper.find(testId('submitButton')).simulate('submit');
    });
    expect(submitHandler.mock.calls.length).toBe(0);
  });

  it('Should fire on submit with correct values', async () => {
    const email = 'email';
    const password = 'password';

    const submitHandler = jest.fn(() => {});

    await act(async () => {
      const wrapper = mount(<Login onSubmit={submitHandler} />);

      hookFormType(wrapper.find(testId('emailInput')), email);
      hookFormType(wrapper.find(testId('passwordInput')), password);
      wrapper.find(testId('submitButton')).simulate('submit');
    });

    expect(submitHandler).toBeCalledTimes(1);
    expect(submitHandler).toBeCalledWith(email, password);
  });
});