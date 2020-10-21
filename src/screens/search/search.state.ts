import { atom, selector } from 'recoil';
import { bookSearch } from 'services/api/book-search';
import { ProviderType } from 'services/api/types';
import { catchError } from 'utils/withSuspense';

export const typeState = atom<ProviderType>({ key: 'type', default: 'zlib' });
export const queryState = atom({ key: 'query', default: '' });

type BookParams = { type: ProviderType; query: string };
export const booksParams = atom<BookParams>({ key: 'booksParams', default: null });

export const booksSelector = selector({
  key: 'books',
  get({ get }) {
    const params = get(booksParams);

    if (!params) return null;
    const { type, query } = params;

    return bookSearch(type, query).catch(catchError());
  },
});
