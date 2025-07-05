"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';

import { useStore } from '@/context/store';
import type { Genre } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const genreSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
});

function AddGenreDialog() {
  const [open, setOpen] = useState(false);
  const { dispatch } = useStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof genreSchema>>({
    resolver: zodResolver(genreSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = (values: z.infer<typeof genreSchema>) => {
    dispatch({ type: 'ADD_GENRE', payload: values });
    toast({ title: 'Gênero adicionado', description: `"${values.name}" foi adicionado com sucesso.` });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Gênero
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Gênero</DialogTitle>
          <DialogDescription>
            Insira os detalhes para o novo gênero.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Gênero</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Bossa Nova" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o gênero..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar Gênero</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteGenreAlert({ genre, onContinue }: { genre: Genre, onContinue: () => void }) {
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o gênero
                    <span className="font-bold"> &quot;{genre.name}&quot; </span>.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onContinue}>Continuar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}

export default function GenresPage() {
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);

  const handleDelete = () => {
    if (genreToDelete) {
      dispatch({ type: 'DELETE_GENRE', payload: { id: genreToDelete.id } });
      toast({ title: 'Gênero excluído', description: `"${genreToDelete.name}" foi removido.` });
      setGenreToDelete(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Gêneros"
        description="Gerencie seus gêneros musicais."
      >
        <AddGenreDialog />
      </PageHeader>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.genres.length > 0 ? (
                state.genres.map((genre) => (
                  <TableRow key={genre.id}>
                    <TableCell className="font-medium">{genre.name}</TableCell>
                    <TableCell className="text-muted-foreground">{genre.description}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setGenreToDelete(genre)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Nenhum gênero encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!genreToDelete} onOpenChange={(open) => !open && setGenreToDelete(null)}>
        {genreToDelete && <DeleteGenreAlert genre={genreToDelete} onContinue={handleDelete} />}
      </AlertDialog>
    </>
  );
}
