import React, { useCallback } from 'react';
import TopTabs from '@components/Common/TopTabs/TopTabs';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';

function ProfileTopTabs(): React.JSX.Element {
  const profileScreenContext = useProfileScreenContext();

  const onTabChange = useCallback((index: number) => {
    profileScreenContext.setSelectedTab?.(index);
    profileScreenContext.pagerViewRef?.current?.setPageWithoutAnimation(index);
  }, []);

  return (
    <TopTabs
      onChange={onTabChange}
      items={['Posts', 'Comments']}
      selectedIndex={profileScreenContext.selectedTab}
    />
  );
}

export default React.memo(ProfileTopTabs);
