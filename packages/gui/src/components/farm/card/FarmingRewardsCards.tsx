import { useGetBlockchainStateQuery, useGetTotalHarvestersSummaryQuery } from '@xxch-network/api-react';
import { State, CardSimple, useCurrencyCode, mojoToXxchLocaleString, useLocale, calculateReward } from '@xxch-network/core';
import { Trans } from '@lingui/macro';
import { Grid, Typography, Box } from '@mui/material';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import React, { useMemo } from 'react';

import FullNodeState from '../../../constants/FullNodeState';
import useFullNodeState from '../../../hooks/useFullNodeState';

import FarmCardNotAvailable from './FarmCardNotAvailable';

const MOJO_PER_XXCH = 1_000_000_000_000;
function getBlockRewardByHeight(height: number) {
  return calculateReward(height) * MOJO_PER_XXCH;
}

export default React.memo(FarmingRewardsCards);
function FarmingRewardsCards() {
  const { state: fullNodeState } = useFullNodeState();

  const { data, isLoading: isLoadingBlockchainState, error: errorBlockchainState } = useGetBlockchainStateQuery();
  const {
    totalEffectivePlotSize,
    isLoading: isLoadingTotalHarvesterSummary,
    error: errorLoadingPlots,
  } = useGetTotalHarvestersSummaryQuery();
  const currencyCode = useCurrencyCode();
  const [locale] = useLocale();

  const isLoading = isLoadingBlockchainState || isLoadingTotalHarvesterSummary;
  const error = errorBlockchainState || errorLoadingPlots;

  const totalNetworkSpace = useMemo(() => new BigNumber(data?.space ?? 0), [data]);

  const proportion = useMemo(() => {
    if (isLoading || totalNetworkSpace.isZero()) {
      return new BigNumber(0);
    }

    return totalEffectivePlotSize.div(totalNetworkSpace);
  }, [isLoading, totalEffectivePlotSize, totalNetworkSpace]);

  const expectedTimeToWinSeconds = React.useMemo(() => {
    if (fullNodeState !== FullNodeState.SYNCED || !data) {
      return null;
    }

    return !proportion.isZero() ? new BigNumber(data.averageBlockTime).div(proportion) : new BigNumber(0);
  }, [proportion, data, fullNodeState]);

  const expectedTimeToWinCard = React.useMemo(() => {
    if (fullNodeState !== FullNodeState.SYNCED || !expectedTimeToWinSeconds) {
      const state = fullNodeState === FullNodeState.SYNCHING ? State.WARNING : undefined;

      return <FarmCardNotAvailable title={<Trans>Estimated Time to Win</Trans>} state={state} />;
    }

    const minutes = expectedTimeToWinSeconds.div(60);
    const expectedTimeToWinHumanized = moment
      .duration({
        minutes: minutes.toNumber(),
      })
      .humanize();

    return (
      <CardSimple
        title={<Trans>Estimated Time to Win</Trans>}
        value={`${expectedTimeToWinHumanized}`}
        tooltip={
          <Trans>
            You have {proportion.multipliedBy(100).toNumber().toFixed(4)}% of the space on the network, so farming a
            block will take {expectedTimeToWinHumanized} in expectation. Actual results may take 3 to 4 times longer
            than this estimate.
          </Trans>
        }
        loading={isLoading}
        error={error}
      />
    );
  }, [proportion, expectedTimeToWinSeconds, fullNodeState, isLoading, error]);

  const estimatedDailyXXCHCard = React.useMemo(() => {
    if (fullNodeState !== FullNodeState.SYNCED || !expectedTimeToWinSeconds || !data) {
      const state = fullNodeState === FullNodeState.SYNCHING ? State.WARNING : undefined;

      return <FarmCardNotAvailable title={<Trans>Estimated daily XXCH</Trans>} state={state} />;
    }

    const estimatedDailyXXCH = new BigNumber(86_400)
      .div(expectedTimeToWinSeconds)
      .multipliedBy(getBlockRewardByHeight(data.peak?.height))
      .dp(0);

    return (
      <CardSimple
        title={<Trans>Estimated daily XXCH</Trans>}
        value={
          <>
            {mojoToXxchLocaleString(estimatedDailyXXCH, locale)}
            &nbsp;
            {currencyCode}
          </>
        }
        loading={isLoading}
        error={error}
      />
    );
  }, [data, expectedTimeToWinSeconds, fullNodeState, isLoading, error, currencyCode, locale]);

  const estimatedMonthlyXXCHCard = React.useMemo(() => {
    if (fullNodeState !== FullNodeState.SYNCED || !expectedTimeToWinSeconds || !data) {
      const state = fullNodeState === FullNodeState.SYNCHING ? State.WARNING : undefined;

      return <FarmCardNotAvailable title={<Trans>Estimated monthly XXCH</Trans>} state={state} />;
    }

    const estimatedMonthlyXXCH = new BigNumber(86_400 * 31)
      .div(expectedTimeToWinSeconds)
      .multipliedBy(getBlockRewardByHeight(data.peak?.height))
      .dp(0);

    return (
      <CardSimple
        title={<Trans>Estimated monthly XXCH</Trans>}
        value={
          <>
            {mojoToXxchLocaleString(estimatedMonthlyXXCH, locale)}
            &nbsp;
            {currencyCode}
          </>
        }
        loading={isLoading}
        error={error}
      />
    );
  }, [data, expectedTimeToWinSeconds, fullNodeState, isLoading, error, currencyCode, locale]);

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 1 }}>
        <Trans>Farming Rewards</Trans>
      </Typography>
      <Grid spacing={2} alignItems="stretch" container>
        <Grid xs={12} sm={6} md={4} item>
          {expectedTimeToWinCard}
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          {estimatedDailyXXCHCard}
        </Grid>
        <Grid xs={12} sm={6} md={4} item>
          {estimatedMonthlyXXCHCard}
        </Grid>
      </Grid>
    </Box>
  );
}
