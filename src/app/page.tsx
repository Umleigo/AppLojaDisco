"use client"

import { useStore } from "@/context/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disc3, Library, Users } from "lucide-react";

export default function Home() {
  const { state } = useStore();

  const stats = [
    {
      title: "Discos de Vinil",
      count: state.records.length,
      icon: <Disc3 className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Gêneros",
      count: state.genres.length,
      icon: <Library className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: "Autores",
      count: state.authors.length,
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center py-16">
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-primary">
          Loja de Disco
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
          Seu parceiro moderno na gestão de músicas clássicas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
