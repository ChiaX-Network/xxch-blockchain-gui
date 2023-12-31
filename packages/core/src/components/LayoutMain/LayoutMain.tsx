import { alpha, Container } from '@mui/material';
import React, { ReactElement, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Color from '../../constants/Color';
import Flex from '../Flex';

import LayoutFooter from './LayoutFooter';

const StyledContainer = styled(Container)`
  padding-top: ${({ theme }) => `${theme.spacing(3)}`};
  padding-bottom: ${({ theme }) => `${theme.spacing(3)}`};
  flex-grow: 1;
  display: flex;
`;

const StyledInnerContainer = styled(Flex)`
  box-shadow: inset 6px 0 8px -8px ${alpha(Color.Neutral[900], 0.2)};
  flex-grow: 1;
`;

const StyledBody = styled(Flex)`
  min-width: 0;
`;

export type LayoutMainProps = {
  children?: ReactElement<any>;
  bodyHeader?: ReactNode;
  outlet?: boolean;
};

export default function LayoutMain(props: LayoutMainProps) {
  const { children, bodyHeader, outlet = false } = props;

  return (
    <>
      <StyledInnerContainer flexDirection="column">
        {bodyHeader}
        <StyledContainer maxWidth="lg">
          <StyledBody flexDirection="column" gap={2} flexGrow="1">
            {outlet ? <Outlet /> : children}
          </StyledBody>
        </StyledContainer>
      </StyledInnerContainer>
      <LayoutFooter />
    </>
  );
}
