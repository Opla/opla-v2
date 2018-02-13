import React from 'react';
import renderer from 'react-test-renderer';
import IconExButton from 'OplaLibs/components/IconExButton';

describe('IconExButton', () => {
  it('renders a robot icon', () => {
    const component = renderer.create(<IconExButton name="robot" />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders a opla icon', () => {
    const component = renderer.create(<IconExButton name="opla" />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders a generic icon', () => {
    const component = renderer.create(<IconExButton name="some name" />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
