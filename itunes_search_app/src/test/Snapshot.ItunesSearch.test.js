import React from 'react';
import renderer from 'react-test-renderer';

//check rendering by creating a p element 'this is a snapshot'
test('renders correctly', () => {
    const tree = renderer
    .create(<p>This is a snapshot</p>)
    .toJSON();
    expect(tree).toMatchSnapshot();
    });