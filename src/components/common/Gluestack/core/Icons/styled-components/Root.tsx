import { AsForwarder } from '@gluestack-style/react';
import { styled } from '../../styled';

const Comp: any = styled(
  AsForwarder,
  {
    fill: 'none',
  },
  {
    ancestorStyle: ['_icon'],
  },
  {
    propertyTokenMap: {
      stroke: 'colors',
    },
  }
);

export default Comp;
