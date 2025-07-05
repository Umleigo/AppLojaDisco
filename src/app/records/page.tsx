"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';

import { useStore } from '@/context/store';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from '@/lib/utils';


const recordSchema = z.object({
  title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres.'),
  genreId: z.string({ required_error: 'Por favor, selecione um gênero.' }),
  authorIds: z.array(z.string()).min(1, 'Por favor, selecione pelo menos um autor.'),
});

function AddRecordDialog() {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof recordSchema>>({
    resolver: zodResolver(recordSchema),
    defaultValues: { title: '', authorIds: [] },
  });

  const onSubmit = (values: z.infer<typeof recordSchema>) => {
    dispatch({ type: 'ADD_RECORD', payload: values });
    toast({ title: 'Disco adicionado', description: `"${values.title}" foi adicionado com sucesso.` });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Disco
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Disco de Vinil</DialogTitle>
          <DialogDescription>
            Insira os detalhes do novo vinil.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Abbey Road" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genreId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Gênero</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? state.genres.find(
                                (genre) => genre.id === field.value
                              )?.name
                            : "Selecione o gênero"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar gênero..." />
                        <CommandEmpty>Nenhum gênero encontrado.</CommandEmpty>
                        <CommandGroup>
                          {state.genres.map((genre) => (
                            <CommandItem
                              value={genre.name}
                              key={genre.id}
                              onSelect={() => {
                                form.setValue("genreId", genre.id)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  genre.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {genre.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authorIds"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Autores</FormLabel>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <div className="flex gap-1 flex-wrap">
                          {field.value.length > 0 ? (
                             state.authors
                              .filter(author => field.value.includes(author.id))
                              .map(author => <Badge key={author.id}>{author.name}</Badge>)
                          ) : "Selecione os autores"}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar autores" />
                        <CommandList>
                          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                          <CommandGroup>
                            {state.authors.map(author => {
                              const isSelected = field.value.includes(author.id);
                              return (
                                <CommandItem
                                  key={author.id}
                                  onSelect={() => {
                                    if (isSelected) {
                                      field.onChange(field.value.filter(id => id !== author.id));
                                    } else {
                                      field.onChange([...field.value, author.id]);
                                    }
                                  }}
                                >
                                  <div className={cn("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")}>
                                      <Check className="h-4 w-4" />
                                  </div>
                                  <span>{author.name}</span>
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar Disco</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function RecordsPage() {
  const { state, dispatch } = useStore();
  const { toast } = useToast();

  const handleStatusChange = (recordId: string, title: string) => {
    dispatch({ type: 'TOGGLE_RECORD_STATUS', payload: { id: recordId } });
    toast({ title: 'Status atualizado', description: `O status de "${title}" foi alterado.` });
  };
  
  const getGenreName = (genreId: string) => state.genres.find(g => g.id === genreId)?.name || 'N/A';
  const getAuthorNames = (authorIds: string[]) => {
      if (!authorIds) return 'N/A';
      return authorIds
          .map(id => state.authors.find(a => a.id === id)?.name)
          .filter(Boolean)
          .join(', ');
  }

  return (
    <>
      <PageHeader
        title="Discos de Vinil"
        description="Navegue e gerencie sua coleção de discos."
      >
        <AddRecordDialog />
      </PageHeader>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Gênero</TableHead>
                <TableHead>Autor(es)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Ativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.records.length > 0 ? (
                state.records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.title}</TableCell>
                    <TableCell>{getGenreName(record.genreId)}</TableCell>
                    <TableCell className="text-muted-foreground">{getAuthorNames(record.authorIds)}</TableCell>
                    <TableCell>
                      <Badge variant={record.active ? 'default' : 'outline'}>
                        {record.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={record.active}
                        onCheckedChange={() => handleStatusChange(record.id, record.title)}
                        aria-label="Alternar status do disco"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum disco encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
