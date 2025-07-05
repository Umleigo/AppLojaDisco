"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MoreHorizontal, PlusCircle, Trash2, Users } from 'lucide-react';

import { useStore } from '@/context/store';
import type { Author } from '@/lib/types';
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

const authorSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
});

function AddAuthorDialog() {
  const [open, setOpen] = useState(false);
  const { dispatch } = useStore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof authorSchema>>({
    resolver: zodResolver(authorSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = (values: z.infer<typeof authorSchema>) => {
    dispatch({ type: 'ADD_AUTHOR', payload: values });
    toast({ title: 'Autor adicionado', description: `"${values.name}" foi adicionado com sucesso.` });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Autor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Autor</DialogTitle>
          <DialogDescription>
            Digite o nome do novo autor ou artista.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Autor</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Caetano Veloso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar Autor</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAuthorAlert({ author, onContinue }: { author: Author, onContinue: () => void }) {
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o autor
                    <span className="font-bold"> &quot;{author.name}&quot; </span>.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onContinue}>Continuar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}

export default function AuthorsPage() {
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);

  const handleDelete = () => {
    if (authorToDelete) {
      dispatch({ type: 'DELETE_AUTHOR', payload: { id: authorToDelete.id } });
      toast({ title: 'Autor excluído', description: `"${authorToDelete.name}" foi removido.` });
      setAuthorToDelete(null);
    }
  };

  const getRecordCount = (authorId: string) => {
    return state.records.filter(record => record.authorIds.includes(authorId)).length;
  }

  return (
    <>
      <PageHeader
        title="Autores"
        description="Gerencie seus artistas e autores."
      >
        <AddAuthorDialog />
      </PageHeader>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Qtd. de Discos</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.authors.length > 0 ? (
                state.authors.map((author) => (
                  <TableRow key={author.id}>
                    <TableCell className="font-medium">{author.name}</TableCell>
                    <TableCell className="text-muted-foreground">{getRecordCount(author.id)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setAuthorToDelete(author)}>
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
                    Nenhum autor encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!authorToDelete} onOpenChange={(open) => !open && setAuthorToDelete(null)}>
        {authorToDelete && <DeleteAuthorAlert author={authorToDelete} onContinue={handleDelete} />}
      </AlertDialog>
    </>
  );
}
