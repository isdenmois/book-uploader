import React, { useState, useEffect } from 'react';
import { TextStyle, ViewStyle, StyleSheet } from 'react-native';
import * as colors from 'theme/colors';
import { Input } from 'components/input';
import { SearchIcon } from 'components/icons';

type Props = {
  initQuery?: string;
  onSearch: (query: string) => void;
  disabled?: boolean;
};

export function Header({ initQuery, onSearch, disabled }: Props) {
  const [query, setQuery, toSearch] = useSearch(onSearch, initQuery);

  return (
    <Input
      value={query}
      onChange={setQuery}
      onSubmit={toSearch}
      disabled={disabled}
      initValue={initQuery}
      icon={<SearchIcon size={24} color={colors.Search} />}
      autoFocus
    />
  );
}

export function useSearch(onSearch, initQuery) {
  const [query, setQuery] = useState(initQuery || '');

  useEffect(() => {
    setQuery(initQuery || '');
  }, [initQuery]);

  const toSearch = () => {
    setQuery(query.trim());
    onSearch(query.trim());
  };

  return [query, setQuery, toSearch];
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 15,
    marginHorizontal: 15,
    backgroundColor: colors.Input,
    borderRadius: 10,
    elevation: 4,
  } as ViewStyle,
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    color: colors.SearchText,
  } as TextStyle,
});
