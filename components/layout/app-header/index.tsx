'use client';

import GlobalSearch from './global-search';
import { SyncUp } from './sync-up';
import { AccountCrown } from './account-crown';

export const AppHeader = () => {
  return (
    <header className="border-b border-border bg-background fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex w-full items-center justify-between gap-4 px-4 py-3">
        <GlobalSearch className="max-w-xl" />
        <div className="flex items-center gap-1">
          <SyncUp />
          <AccountCrown />
        </div>
      </div>
    </header>
  );
};
