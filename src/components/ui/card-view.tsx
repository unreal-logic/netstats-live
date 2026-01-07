'use client'

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardViewProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export function CardView({ title, subtitle, description }: CardViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
