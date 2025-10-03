import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";

import NoteClient from "./Notes.client";

interface NoteProps {
  params: Promise<{ slug: string[] }>;
}

const Notes = async ({ params }: NoteProps) => {
  const { slug } = await params;
  const [category] = slug;

  const filter = category !== "All" ? category : undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", filter],
    queryFn: () => fetchNotes("", 1, filter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteClient filter={filter} />
    </HydrationBoundary>
  );
};

export default Notes;
