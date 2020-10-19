import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import * as colors from 'theme/colors';
import { bookSearch, PROVIDER_TYPE } from 'services/api/book-search';
import { Header } from './header';
import { BookItem } from './book-item';

type Props = {
  route: any;
};

type State = {
  loading: boolean;
  books: any[];
  type: PROVIDER_TYPE;
};

export class SearchScreen extends Component<Props, State> {
  state: State = {
    type: 'zlib',
    loading: false,
    books: null,
  };

  render() {
    const { books, loading } = this.state;
    const routeParams = this.props.route.params;

    return (
      <View style={s.container}>
        {this.renderToggler()}

        <Header onSearch={this.search} initQuery={routeParams?.initQuery} disabled={loading} />

        {loading && <ActivityIndicator size='large' color='red' />}
        {!loading && !books && <Text>Start search</Text>}
        {!loading && !!books && !books.length && <Text>Nothing has found</Text>}

        {books?.length && (
          <FlatList
            data={books}
            keyExtractor={item => item.link}
            renderItem={({ item }) => <BookItem item={item} />}
            contentContainerStyle={s.listContent}
          />
        )}
      </View>
    );
  }

  renderToggler() {
    const { loading, type } = this.state;

    return (
      <View style={s.togglerContainer}>
        <TouchableOpacity style={s.toggler} onPress={this.toggleType} disabled={loading}>
          <Text style={s.togglerText}>{type === 'zlib' ? 'Z-Library' : 'Flibusta'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  toggleType = () => this.setState({ type: this.state.type === 'zlib' ? 'flibusta' : 'zlib', books: null });

  search = async (query: string) => {
    const type = this.state.type;
    this.setState({ loading: true, books: null });

    try {
      const { data } = await bookSearch(type, query);

      this.setState({ books: data });
    } catch (e) {
      console.error(e?.message || e);
    }

    this.setState({ loading: false });
  };
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.Background,
  } as ViewStyle,
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 60,
  } as ViewStyle,
  togglerContainer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    left: 0,
    right: 0,
    zIndex: 2,
  } as ViewStyle,
  toggler: {
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  } as ViewStyle,
  togglerText: {
    flex: 1,
    fontSize: 16,
  } as TextStyle,
});
