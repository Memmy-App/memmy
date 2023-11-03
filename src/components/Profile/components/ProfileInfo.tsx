import React, { useCallback, useMemo } from 'react';
import { Text, XStack, YStack } from 'tamagui';
import {
  useBlockedPersons,
  useCurrentAccount,
  useProfileActorId,
  useProfileBio,
  useProfileCounts,
  useProfileName,
} from '@src/state';
import { useProfileScreenContext } from '@components/Profile/screens/ProfileScreen';
import { getBaseUrl } from '@helpers/links';
import ProfileTopTabs from '@components/Profile/components/Tabs/ProfileTopTabs';
import ButtonOne from '@components/Common/Button/ButtonOne';
import { Bookmark, Hand } from '@tamagui/lucide-icons';
import instance from '@src/Instance';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

function ProfileHeader(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { profileId } = useProfileScreenContext();
  const personName = useProfileName(profileId);
  const personActorId = useProfileActorId(profileId);
  const personCounts = useProfileCounts(profileId);
  const personBio = useProfileBio(profileId);

  const currentAccount = useCurrentAccount();

  const blockedPersons = useBlockedPersons();

  const isBlocked = useMemo(() => {
    return blockedPersons?.findIndex((p) => p.target.id === profileId) !== -1;
  }, [blockedPersons]);

  const isSelf = useMemo(
    () => currentAccount?.username.toLowerCase() === personName?.toLowerCase(),
    [personName, currentAccount?.username],
  );

  const personInstance = useMemo(
    () => getBaseUrl(personActorId),
    [personActorId],
  );

  const totalScore = useMemo(
    () =>
      (
        (personCounts?.comment_score ?? 0) + (personCounts?.post_score ?? 0)
      ).toLocaleString(),
    [personCounts?.comment_score, personCounts?.post_score],
  );

  const onBlockPress = useCallback(() => {
    void instance.blockPerson({
      personId: profileId,
      block: !isBlocked,
    });
  }, [isBlocked]);

  return (
    <>
      <YStack mx="$3" space="$2.5" pb="$2">
        <XStack ml="auto" width="30%" py="$2" space="$3" right={10}>
          {!isSelf ? (
            <ButtonOne
              label={isBlocked ? 'Unblock' : 'Block'}
              icon={Hand}
              isIconFilled={isBlocked}
              onPress={onBlockPress}
              backgroundColor="$fg"
            />
          ) : (
            <ButtonOne
              label="Saved"
              icon={Bookmark}
              onPress={() => navigation.navigate('SavedPosts')}
              backgroundColor="$fg"
            />
          )}
        </XStack>

        <YStack space="$0.5">
          <Text fontSize="$5" fontWeight="bold">
            {personName}
          </Text>
          <Text fontSize="$3" color="$secondary">
            @{personInstance}
          </Text>
        </YStack>
        <XStack space="$3">
          <Text fontSize="$2" color="$secondary" fontWeight="$7">
            {personCounts?.post_count.toLocaleString()} Posts
          </Text>
          <Text fontSize="$2" color="$secondary" fontWeight="$7">
            {personCounts?.comment_count.toLocaleString()} Comments
          </Text>
          <Text fontSize="$2" color="$secondary" fontWeight="$7">
            {totalScore} Total Score
          </Text>
        </XStack>
        <XStack>
          <Text fontSize="$3" color="$color" numberOfLines={2}>
            {personBio}
          </Text>
        </XStack>
      </YStack>
      <ProfileTopTabs />
    </>
  );
}

export default React.memo(ProfileHeader);
