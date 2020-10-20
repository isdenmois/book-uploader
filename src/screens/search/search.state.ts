import { atom, selector } from 'recoil';
import { bookSearch, PROVIDER_TYPE } from 'services/api/book-search';
import { catchError } from 'utils/withSuspense';

export const typeState = atom<PROVIDER_TYPE>({ key: 'type', default: 'zlib' });
export const queryState = atom({ key: 'query', default: '' });

type BookParams = { type: PROVIDER_TYPE; query: string };
export const booksParams = atom<BookParams>({ key: 'booksParams', default: null });

export const booksSelector = selector({
  key: 'books',
  get({ get }) {
    const params = get(booksParams);

    if (!params) return null;
    const { type, query } = params;

    return bookSearch(type, query)
      .then(r => r.data)
      .catch(catchError());
  },
});
