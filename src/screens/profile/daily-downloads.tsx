import { useFocusEffect } from '@react-navigation/native';
import { ProgressBar } from 'components/progress-bar';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { useRecoilValue } from 'recoil';
import { getDailyDownloads } from 'services/api/daily-downloads';
import { dynamicColor, useSColor } from 'theme/colors';
import { profileState } from './profile.state';

export function DailyDownloads() {
  const { s, color } = useSColor(ds);
  const { loading, count, max, resetTime } = useDownloadCount();
  const progress = max > 0 ? Math.round((count / max) * 100) : 0;

  return (
    <View>
      <Text style={s.downloads}>Daily downloads {resetTime ? `(${resetTime})` : ''}</Text>

      {loading && <ActivityIndicator size='large' color={color.profileSelected} />}

      {!loading && (
        <ProgressBar progress={progress} color={color.profileSelected} text={`${count} / ${max}`} showAlways />
      )}
    </View>
  );
}

function useDownloadCount() {
  const cookie = useRecoilValue(profileState);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [max, setMax] = useState(0);
  const [resetTime, setResetTime] = useState(null);

  const fetchDailyDownloads = useCallback(() => {
    setLoading(true);
    setCount(0);
    setMax(0);
    setResetTime(null);

    getDailyDownloads(cookie)
      .then(data => {
        setCount(data.dailyDownloads);
        setMax(data.dailyDownloadsLimit);
        setResetTime(data.resetTime);
      })
      .finally(() => setLoading(false));
  }, [cookie]);

  useFocusEffect(fetchDailyDownloads);

  return { loading, count, max, resetTime };
}

const ds = new DynamicStyleSheet({
  downloads: {
    color: dynamicColor.profileText,
    fontSize: 16,
    marginTop: 30,
    marginBottom: 5,
    textAlign: 'center',
  },
});
