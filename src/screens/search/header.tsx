import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { StyleSheet, View, ViewStyle } from 'react-native';
import * as colors from 'theme/colors';
import { Input } from 'components/input';
import { SearchIcon } from 'components/icons';
import { Chip } from 'components/chip';
import { booksParams, queryState, typeState } from './search.state';

type Props = {
  initQuery?: string;
  onSearch: () => void;
  disabled?: boolean;
};

export function Header({ initQuery, onSearch, disabled }: Props) {
  const [type, setZLib, setFlibusta] = useType();
  useInitQuery(initQuery);

  return (
    <>
      <Input
        state={queryState}
        onSubmit={onSearch}
        disabled={disabled}
        initValue={initQuery}
        placeholder='Search books by title '
        icon={<SearchIcon size={24} color={colors.Search} />}
        autoFocus
      />

      <View style={s.row}>
        <Chip title='Z-Library' selected={type === 'zlib'} onPress={setZLib} disabled={disabled} />
        <Chip title='Flibusta' selected={type === 'flibusta'} onPress={setFlibusta} disabled={disabled} />
      </View>
    </>
  );
}

function useInitQuery(initQuery) {
  const setQuery = useSetRecoilState(queryState);

  useEffect(() => {
    setQuery(initQuery || '');
  }, [initQuery]);
}

export function useType() {
  const setParams = useSetRecoilState(booksParams);
  const [type, setType] = useRecoilState(typeState);

  const setZLib = () => (setType('zlib'), setParams(null));
  const setFlibusta = () => (setType('flibusta'), setParams(null));

  return [type, setZLib, setFlibusta] as const;
}

const s = StyleSheet.create({
  row: { flexDirection: 'row' } as ViewStyle,
});
