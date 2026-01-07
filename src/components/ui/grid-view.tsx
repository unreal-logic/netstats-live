'use client'

import React from 'react';
import { CardView } from '@/components/ui/card-view';

interface GridViewProps<T> {
  data: T[];
  renderItem: (item: T) => { title: string; subtitle?: string; description?: string };
}

export function GridView<T extends { id: string }>({ data, renderItem }: GridViewProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">No items to display.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map((item) => {
        const { title, subtitle, description } = renderItem(item);
        return <CardView key={item.id} title={title} subtitle={subtitle} description={description} />;
      })}
    </div>
  );
}
