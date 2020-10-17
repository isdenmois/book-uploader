import React, { useState, useEffect } from 'react';
import { View, TextStyle, ViewStyle, StyleSheet, TextInput } from 'react-native';
import { useAutofocus } from 'utils/autofocus';

type Props = {
  initQuery?: string;
  onSearch: (query: string) => void;
  disabled?: boolean;
};

export function Header({ initQuery, onSearch, disabled }: Props) {
  const [query, setQuery, toSearch] = useSearch(onSearch, initQuery);
  const inputRef = useAutofocus([initQuery]);

  return (
    <View style={s.container}>
      <TextInput
        testID='search-header-input'
        style={s.input}
        editable={!disabled}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={toSearch}
        returnKeyType='search'
        placeholder='Search books'
        ref={inputRef}
        autoFocus
      />
    </View>
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
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  } as ViewStyle,
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  } as TextStyle,
});
